import ResourceBar from '@/components/resource/resourceBar'; // Adjust the import path
import ResourceBarSkeleton from '@/components/resource/ResourceBarSkeleton'; // Import the skeleton
import { Package, Truck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import ResourceModify from './resourceModify';

interface ResourceListProps {
    loading: boolean;
    resources: any[];
}

const ResourceList: React.FC<ResourceListProps> = ({ loading, resources }) => {
    const [showModify, setShowModify] = useState(false);

    const handleButtonClick = () => {
        setShowModify(true);
    }

    return (
        <>
            {showModify ? (
                <ResourceModify />
            ) : (
                <>
                    <div className="w-full flex justify-end">
                            <Button onClick={handleButtonClick} className="bg-[#0077B6] hover:bg-[#038BD4] mr-6">Add Resource</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 p-6">
                        {loading ? (
                            // Show skeletons while loading
                            Array.from({ length: 10 }).map((_, index) => (
                                <ResourceBarSkeleton key={index} />
                            ))
                        ) : (
                            resources.map((resource, index) => (
                                <ResourceBar 
                                    key={index}
                                    icon={resource.icon === "Package" ? Package : resource.icon === "Truck" ? Truck : Users} // Map icon names to actual components
                                    name={resource.name}
                                    category={resource.category}
                                    number={resource.number}
                                    // actionLabel={resource.actionLabel}
                                    // onActionClick={() => handleAction(resource.name)}
                                />
                            ))
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default ResourceList;