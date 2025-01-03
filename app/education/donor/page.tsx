"use client";

import { useEffect, useState } from "react";
import SideBarComponent from "@/components/dashboard/sideBar";
import { User } from '@supabase/supabase-js'
import { useRouter } from "next/navigation";
import { UserType } from '@/datatypes/types';
import { getUser, signOut } from '@/lib/authFactory';
import { toast, ToastContainer } from 'react-toastify';
import { Breadcrumb, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbItem, BreadcrumbList } from '@/components/ui/breadcrumb';
import { Eye, Pencil, Trash2, Upload, Download, Edit2 } from 'lucide-react';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from 'date-fns';
import "react-toastify/dist/ReactToastify.css";
import { supabase } from '@/lib/supabaseClient';


interface Content {
  id: string;
  category: string;
  title: string;
  description: string;
  file_url: string;
  created_at: string;
  user_id: string;
}


const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB


const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'image/jpeg',
  'image/png'
];


interface FileUpload {
  file: File;
  title: string;
}


const DonorPage = () => {
  // States
  const [userData, setUserData] = useState<UserType | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [contents, setContents] = useState<Content[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [filesToUpload, setFilesToUpload] = useState<FileUpload[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<Content | null>(null);
  const [categoryPic, setCategoryPic] = useState<File | null>(null);
  const [newTitle, setNewTitle] = useState("");


  const router = useRouter();


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserData = sessionStorage.getItem('user');
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
    }


    const fetchUser = async () => {
      const currentUser = await getUser();
      if (!currentUser) {
        toast.error('User not found! Redirecting to login...');
        router.push('/auth/login');
      } else {
        setUser(currentUser);
      }
    };


    fetchUser();
    fetchContents();
    fetchCategories();
  }, [router]);


  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('No active session found');
        router.push('/auth/login');
        return;
      }
      console.log('Current user ID:', session.user.id); // Debug log
    };


    checkSession();
  }, []);


  const fetchContents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('contents')
        .select('*')
        .order('created_at', { ascending: false });


      if (error) throw error;
      setContents(data || []);
    } catch (error) {
      toast.error('Error fetching contents');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };


  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('name')
        .order('name', { ascending: true });


      if (error) throw error;
      setCategories(data.map(cat => cat.name));
    } catch (error) {
      toast.error('Error fetching categories');
      console.error(error);
    }
  };


  const handleFileUpload = async () => {
    if (!user?.id) {
      toast.error("You must be logged in to upload files");
      return;
    }


    if (!selectedCategory && !newCategory) {
      toast.error("Please select or create a category");
      return;
    }


    if (filesToUpload.length === 0) {
      toast.error("Please select files to upload");
      return;
    }


    setIsUploading(true);
    const category = newCategory || selectedCategory;


    try {
      // Add logic to upload category picture if a new category is created
      if (newCategory && categoryPic) {
        const { error: picUploadError } = await supabase.storage
          .from('category-pics')
          .upload(`category_pics/${categoryPic.name}`, categoryPic);


        if (picUploadError) {
          toast.error(`Error uploading category picture: ${picUploadError.message}`);
          return;
        }
      }


      for (const fileUpload of filesToUpload) {
        const { file, title } = fileUpload;
       
        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`File ${file.name} is too large. Maximum size is 50MB`);
          continue;
        }


        // Validate file type
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
          toast.error(`File type not allowed for ${file.name}`);
          continue;
        }


        const timestamp = new Date().getTime();
        const fileExt = file.name.split('.').pop();
        const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${category}/${fileName}`;


        const { error: uploadError } = await supabase.storage
          .from('donor-files')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });


        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast.error(`Error uploading ${file.name}`);
          continue;
        }


        const { error: contentError } = await supabase
          .from('contents')
          .insert([{
            category,
            title: title || file.name, // Use custom title if provided
            description,
            file_url: filePath,
            user_id: user.id
          }])
          .select();


        if (contentError) {
          console.error('Content error:', contentError);
          toast.error(`Error saving ${file.name} details`);
          continue;
        }
      }


      toast.success('Files uploaded successfully!');
      await fetchContents();
      setFilesToUpload([]); // Clear the files list
      setDescription("");
      setSelectedCategory("");
      setNewCategory("");
      setShowNewCategoryInput(false);
    } catch (error) {
      console.error('Error details:', error);
      toast.error('Error uploading files: ' + (error as Error).message);
    } finally {
      setIsUploading(false);
    }
  };


  const handleDeleteContent = async (id: string) => {
    try {
      const content = contents.find(c => c.id === id);
      if (!content) return;


      await supabase.storage
        .from('donor-files')
        .remove([content.file_url]);


      const { error } = await supabase
        .from('contents')
        .delete()
        .eq('id', id);


      if (error) throw error;


      toast.success('Content deleted successfully');
      fetchContents();
    } catch (error) {
      toast.error('Error deleting content');
      console.error(error);
    }
  };


  const handleUpdateDescription = async (id: string, newDescription: string) => {
    try {
      const { error } = await supabase
        .from('contents')
        .update({ description: newDescription })
        .eq('id', id);


      if (error) throw error;


      toast.success('Description updated successfully');
      fetchContents();
      setSelectedContent(null);
    } catch (error) {
      toast.error('Error updating description');
      console.error(error);
    }
  };


  const handleViewContent = async (content: Content) => {
    try {
      const { data, error } = await supabase.storage
        .from('donor-files')
        .createSignedUrl(content.file_url, 60);


      if (error) {
        console.error('Signed URL error:', error);
        const { data: { publicUrl } } = supabase.storage
          .from('donor-files')
          .getPublicUrl(content.file_url);
       
        window.open(publicUrl, '_blank');
        return;
      }


      window.open(data.signedUrl, '_blank');
    } catch (error) {
      console.error('View error:', error);
      toast.error('Error viewing content: ' + (error as Error).message);
    }
  };


  const handleLogout = async () => {
    await signOut();
    toast.success('Successfully logged out!');
    setTimeout(() => {
      router.push('/auth/login');
    }, 1000);
  };


  const handleEditDescription = async () => {
    if (!selectedContent) {
      console.log("No content selected");
      return;
    }
   
    try {
      console.log("Updating description for:", selectedContent.id, "New description:", newDescription);
     
      const { data, error } = await supabase
        .from('contents')
        .update({ description: newDescription })
        .eq('id', selectedContent.id)
        .select()
        .single();


      if (error) {
        throw error;
      }


      if (!data) {
        throw new Error('No data returned from update');
      }


      setContents(prevContents =>
        prevContents.map(content =>
          content.id === selectedContent.id
            ? { ...content, description: newDescription }
            : content
        )
      );


      toast({
        title: "Success",
        description: "Description updated successfully",
      });


      setIsEditOpen(false);
      setSelectedContent(null);
      setNewDescription("");
     
    } catch (error) {
      console.error('Error updating description:', error);
      toast({
        title: "Error",
        description: "Failed to update description. Please try again.",
        variant: "destructive",
      });
    }
  };


  const handleEditContent = async () => {
    if (!selectedContent) {
      console.log("No content selected");
      return;
    }


    // Set the newTitle and newDescription to the selected content's values
    setNewTitle(selectedContent.title);
    setNewDescription(selectedContent.description || "");
   
    try {
      const { data, error } = await supabase
        .from('contents')
        .update({
          category: selectedCategory,
          title: newTitle,
          description: newDescription
        })
        .eq('id', selectedContent.id)
        .select()
        .single();


      if (error) {
        throw error;
      }


      if (!data) {
        throw new Error('No data returned from update');
      }


      setContents(prevContents =>
        prevContents.map(content =>
          content.id === selectedContent.id
            ? { ...content, category: selectedCategory, title: newTitle, description: newDescription }
            : content
        )
      );


      toast({
        title: "Success",
        description: "Content updated successfully",
      });


      setIsEditOpen(false);
      setSelectedContent(null);
      setNewDescription("");
      setNewTitle("");


    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: "Error",
        description: "Failed to update content. Please try again.",
        variant: "destructive",
      });
    }
  };


  useEffect(() => {
    fetchCategories();
   
    const handleFocus = () => {
      fetchCategories();
    };
   
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);


  return (
    <div className="h-screen flex overflow-hidden">
      <SideBarComponent userData={userData || undefined} onLogout={handleLogout} />


      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header Section - Fixed at top */}
        <div className="p-8 bg-white border-b shadow-sm">
          <Breadcrumb className="text-sm text-gray-500">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>Education</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="font-giorgio font-bold text-4xl sm:text-5xl md:text-6xl mt-7 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            My Education
          </h1>
        </div>


        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Contents Repository Section */}
          <Card className="transition-all hover:shadow-lg">
            <CardContent className="p-6">
              <CardTitle className="mb-4 text-2xl font-giorgio text-primary">
                Contents Repository
              </CardTitle>
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-4 font-medium text-gray-600 sticky top-0">Category</th>
                        <th className="text-left p-4 font-medium text-gray-600 sticky top-0">Name</th>
                        <th className="text-left p-4 font-medium text-gray-600 sticky top-0">Created At</th>
                        <th className="text-left p-4 font-medium text-gray-600 sticky top-0">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contents.map((content) => (
                        <tr key={content.id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <span className="px-2 py-1 bg-primary/10 rounded-full text-sm">
                              {content.category}
                            </span>
                          </td>
                          <td className="p-4">{content.title}</td>
                          <td className="p-4">{format(new Date(content.created_at), 'PPpp')}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                onClick={() => handleViewContent(content)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>


                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-amber-50 hover:text-amber-600 transition-colors"
                                onClick={() => {
                                  setSelectedContent(content);
                                  setNewDescription(content.description || "");
                                  setIsEditOpen(true);
                                }}
                              >
                                <Edit2 className="h-4 w-4 mr-1" />
                                Edit
                              </Button>


                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-red-50 hover:text-red-600 transition-colors"
                                onClick={() => {
                                  setContentToDelete(content);
                                  setIsDeleteOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>


          {/* Upload Section */}
          <Card>
            <CardContent className="p-6">
              <CardTitle className="mb-4">Upload Content</CardTitle>
              <div className="space-y-4">
                <div className="flex gap-4">
                  {showNewCategoryInput ? (
                    <div className="flex gap-4 w-full">
                      <div className="flex-1">
                        <Input
                          type="text"
                          placeholder="Enter new category name"
                          value={newCategoryInput}
                          onChange={(e) => setNewCategoryInput(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="flex-none">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files) {
                              setCategoryPic(e.target.files[0]);
                            }
                          }}
                          className="w-42"
                        />
                      </div>
                      <Button
                        variant="outline"
                        onClick={async () => {
                          if (newCategoryInput.trim()) {
                            // Upload category picture if provided
                            let categoryPicPath = '';
                            if (categoryPic) {
                              const { error: picUploadError } = await supabase.storage
                                .from('category-pics')
                                .upload(`category_pics/${categoryPic.name}`, categoryPic);


                              if (picUploadError) {
                                toast.error(`Error uploading category picture: ${picUploadError.message}`);
                                return;
                              }
                              categoryPicPath = `category_pics/${categoryPic.name}`;
                            }


                            // Insert new category into the database
                            const { error } = await supabase
                              .from('categories')
                              .insert([{ name: newCategoryInput.trim(), category_pic: categoryPicPath }])
                              .select();


                            if (error) {
                              toast.error('Error creating category');
                              console.error(error);
                              return;
                            }


                            setCategories(prev => [...prev, newCategoryInput.trim()]);
                            setSelectedCategory(newCategoryInput.trim());
                            setNewCategoryInput("");
                            setShowNewCategoryInput(false);
                            toast.success('Category created successfully');
                          }
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowNewCategoryInput(false);
                          setNewCategoryInput("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Select
                        onValueChange={(value) => {
                          if (value === "new") {
                            setShowNewCategoryInput(true);
                            setSelectedCategory("");
                          } else {
                            setSelectedCategory(value);
                          }
                        }}
                        value={selectedCategory}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.sort().map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                          <SelectItem value="new">Create new category</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        onClick={() => setShowNewCategoryInput(true)}
                      >
                        Create New
                      </Button>
                    </>
                  )}
                </div>


                {/* Files list */}
                <div className="space-y-4">
                  {filesToUpload.map((fileUpload, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded">
                      <div className="flex-1">
                        <p className="font-medium">{fileUpload.file.name}</p>
                        <Input
                          type="text"
                          placeholder="Enter title"
                          value={fileUpload.title}
                          onChange={(e) => {
                            const newFiles = [...filesToUpload];
                            newFiles[index].title = e.target.value;
                            setFilesToUpload(newFiles);
                          }}
                          className="mt-2"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setFilesToUpload(files => files.filter((_, i) => i !== index));
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>


                <Textarea
                  placeholder="Content Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px]"
                />


                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                    transition-all hover:border-primary hover:bg-primary/5"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files);
                    setFilesToUpload(prev => [
                      ...prev,
                      ...files.map(file => ({ file, title: file.name }))
                    ]);
                  }}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="mx-auto h-12 w-12 text-primary/60" />
                  <p className="mt-2 text-gray-600">
                    Drag and drop files here or <span className="text-primary font-medium">click to browse</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG
                  </p>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        const files = Array.from(e.target.files);
                        setFilesToUpload(prev => [
                          ...prev,
                          ...files.map(file => ({ file, title: file.name }))
                        ]);
                      }
                    }}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  />
                </div>


                {filesToUpload.length > 0 && (
                  <Button
                    onClick={handleFileUpload}
                    disabled={isUploading}
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                  >
                    {isUploading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        <span>Uploading...</span>
                      </div>
                    ) : (
                      `Upload ${filesToUpload.length} file${filesToUpload.length === 1 ? '' : 's'}`
                    )}
                  </Button>
                )}
               
                {isUploading && <p className="text-center">Uploading...</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <ToastContainer />
      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsEditOpen(false);
            setSelectedContent(null);
            setNewDescription("");
            setNewTitle("");
          } else {
            // Set the default values when the dialog opens
            if (selectedContent) {
              setNewTitle(selectedContent.title);
              setNewDescription(selectedContent.description || "");
              setSelectedCategory(selectedContent.category);
            }
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter content title..."
            />
            <Select
              onValueChange={(value) => setSelectedCategory(value)}
              value={selectedCategory}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.sort().map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Enter content description..."
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditOpen(false);
                setSelectedContent(null);
                setNewDescription("");
                setNewTitle("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditContent}
              className="bg-primary hover:bg-primary/90"
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this content? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteOpen(false);
                setContentToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (contentToDelete) {
                  try {
                    const { error } = await supabase
                      .from('contents')
                      .delete()
                      .eq('id', contentToDelete.id);


                    if (error) throw error;


                    // Update local state to remove the deleted content
                    setContents(prevContents =>
                      prevContents.filter(content => content.id !== contentToDelete.id)
                    );


                    toast({
                      title: "Success",
                      description: "Content deleted successfully.",
                    });
                  } catch (error) {
                    console.error('Error deleting content:', error);
                    toast({
                      title: "Error",
                      description: "Failed to delete content. Please try again.",
                      variant: "destructive",
                    });
                  } finally {
                    setIsDeleteOpen(false);
                    setContentToDelete(null);
                  }
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};


export default DonorPage;