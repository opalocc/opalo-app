import React from 'react';
import { TreeView, TreeDataItem } from '@/renderer/components/ui/tree-view';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/renderer/components/ui/select';

export const Navi = ({ drives, setSelectedDrive, tree, navigate, id }: any) => {
  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Select onValueChange={setSelectedDrive}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="My Drive" />
          </SelectTrigger>
          <SelectContent>
            {drives.map((drive: any) => (
              <SelectItem value={drive.id}>{drive.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <TreeView
        className="h-full max-h-screen overflow-y-auto"
        data={tree}
        initialSelectedItemId={id}
        onSelectChange={(item: TreeDataItem) => navigate(`/dashboard/${item.id}`)}
      />
    </div>
  );
};
