import { useState } from "react";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import React from "react";
import { searchTextInFiles } from "@/renderer/data/google";

export const SearchDialog = ({open, setOpen, navigate, gapi, selectedDrive}: any) => {
    const [files, setFiles] = useState<any[]>([])
  
    const onSelected = (fileId: string) =>{
      navigate(`/dashboard/${fileId}`)
      setOpen(false)
    }
    
    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
          <Command shouldFilter={false}>
            <CommandInput placeholder="Type to search..." onValueChange={async (text: string) => setFiles(await searchTextInFiles(gapi, text, selectedDrive))}/>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Files">
                {files.map((file:any)=> <CommandItem key={file.id} value={file.id} onSelect={() => onSelected(file.id)}><span>{file.name}</span></CommandItem>)}
              </CommandGroup>
            </CommandList>
          </Command>
        </CommandDialog>
    )
  }
  