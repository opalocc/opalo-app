import { useState } from "react";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import React from "react";
import { useGapi } from "@/renderer/hooks/gapi"
import { useNavigate } from "react-router-dom";

export const SearchDialog = ({open, setOpen, selectedDrive}: any) => {
    const [files, setFiles] = useState<any[]>([])
    const { search }: any = useGapi()
    const navigate : any = useNavigate()
    const onSelected = (fileId: string) =>{
      navigate(`/dashboard/${fileId}`)
      setOpen(false)
    }
    
    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
          <Command shouldFilter={false}>
            <CommandInput placeholder="Type to search..." onValueChange={async (text: string) => setFiles(await search(text, selectedDrive))}/>
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
  