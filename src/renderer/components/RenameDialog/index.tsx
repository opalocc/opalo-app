import React from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

export const RenameDialog = ({ dialogData, setDialogData, onRename }: any) => {
    return (    
    <Dialog open={dialogData} onOpenChange={() => setDialogData(undefined)}>
    <DialogContent className="sm:max-w-[425px]">
    <form onSubmit={onRename}> 
        <DialogHeader>
          <DialogTitle>Rename</DialogTitle>
          <DialogDescription>
            Change the name of the file. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input id="name" placeholder="Filename" className="col-span-4" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save</Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>)
}