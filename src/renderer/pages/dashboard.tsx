import React, { useEffect, useState } from "react"
import {
  Folder,
  NotebookText,
  PlusIcon,
} from "lucide-react"
import { GoogleLogin } from "../components/GoogleLogin"
import { Outlet, useNavigate } from "react-router-dom";
import { useGapi } from "../hooks/gapi"
import { TreeView, TreeDataItem } from '../components/ui/tree-view';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Button } from "../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
  
export function Dashboard() {
    const [selectedDrive, setSelectedDrive] = useState<string>()
    const [tree, setTree] = useState([])
    const [dialogData, setDialogData] = useState<any>();
    const [drives, setDrives] = useState([])
    const navigate = useNavigate();
    const {gapi}: any = useGapi();


    async function Rename(event: any) {
      await gapi.client.drive.files.update({
        fileId: dialogData.id,
        name: event.target[0].value
      });
      setDialogData(undefined)
      event.preventDefault()
    }

    async function Remove(event: Event, file: any) {
      await gapi.client.drive.files.update({
        fileId: file.id,
        trashed: true
      });
      listAllFiles(selectedDrive)
      event.preventDefault()
    }

    async function addFile(event: Event, file: any) {
      await gapi.client.drive.files.create({
        resource: {
          parents: [file.id],
          name: "new File.md",
          mimeType: "text/markdown"
        }
      });
      listAllFiles(selectedDrive)
      event.preventDefault()
    }

    async function addFolder(event: Event, file: any) {
      await gapi.client.drive.files.create({
        resource: {
          parents: [file.id],
          name: "new Folder",
          mimeType: "application/vnd.google-apps.folder"
        }
      });
      listAllFiles(selectedDrive)
      event.preventDefault()
    }
    
    function buildTree(elements: any) {
      const tree: any[] = [];
      const map: any = {};
  
      elements.forEach((element: any) => {
          map[element.id] = element;
      });
  
      elements.forEach((element: any) => {
          const parentIds = element.parents;
          parentIds.forEach((parentId: any) => {
              if (map[parentId]) {
                map[parentId].children = map[parentId].children? [...map[parentId].children, map[element.id]] : [map[element.id]];
              } else {
                  tree.push(map[element.id]);
              }
          });
      });
      return tree
  }
  
  async function listAllFiles(selectedDrive?: string): Promise<void> {
    let files: any[] = [];
    let nextPageToken: string | undefined = '';

    while( nextPageToken !== undefined && nextPageToken !== null ) {
      const resp = await gapi.client.drive.files.list( {
        pageSize: 1000,
        driveId: selectedDrive,
        corpora: selectedDrive? "drive" : "user",
        includeItemsFromAllDrives: selectedDrive? true : false,
        supportsAllDrives: selectedDrive? true : false,
        q: "trashed = false and (mimeType = 'text/markdown' or mimeType = 'application/vnd.google-apps.folder')",
        orderBy: "folder",
        fields: 'nextPageToken, files(id, name, mimeType, parents)',
        pageToken: nextPageToken,
      } );

      if( resp.result.files ) {
        files = files.concat( resp.result.files );
      }

      if( !resp.result.nextPageToken ) {
        break;
      }

      nextPageToken = resp.result.nextPageToken;
    }
    
    const tree = buildTree(files.map(file => ({...file, actions: [(
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <PlusIcon className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
          <DropdownMenuItem onClick={(event: any) => {
              addFile(event, file)
            }
          }>
            Add File
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(event: any) => {
              addFolder(event, file)
            }
          }>
            Add Folder
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(event: any) => {
              setDialogData(file)
              event.preventDefault()
            }
          }>
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(event: any) => {
              Remove(event, file)
            }
          }>
            Delete
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>)], 
    icon: file.mimeType ==="text/markdown"? NotebookText : Folder })) );
    setTree(tree);
  }

  const listDrives = async () => {
    const accessToken = gapi.auth.getToken()?.access_token;
  
    if (!accessToken) {
      alert("No access Token Found.");
      return;
    }

    try {
      const response = await gapi.client.drive.drives.list({
        'pageSize': 100,
        'fields': "nextPageToken, drives(id, name)",
      });
      setDrives([{name: "My Drive", id: null}, ...response.result.drives])
    } catch (error) {
      console.error(error);
    }
  }
  
  useEffect(() => {
      if (!gapi)
          return
      listDrives()
      listAllFiles()
  },[gapi])


  useEffect(() => {
    if (!gapi)
        return
    listAllFiles(selectedDrive)
},[selectedDrive])

  return (
    <>
    <Dialog open={dialogData} onOpenChange={() => setDialogData(undefined)}>
    <DialogContent className="sm:max-w-[425px]">
    <form onSubmit={(e: any) =>Rename(e)}> 
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
    </Dialog>
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <a href="/" className="flex items-center gap-2 font-semibold">
            <Select onValueChange={setSelectedDrive}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="My Drive" />
              </SelectTrigger>
              <SelectContent>
                {drives.map((drive: any) => <SelectItem value={drive.id}>{drive.name}</SelectItem>)}
              </SelectContent>
            </Select>
              
            </a>
          </div>
          <TreeView className="h-full max-h-screen overflow-y-auto" data={tree} onSelectChange={(item: TreeDataItem) => navigate(`/${item.id}`)}/>
          <div className="mt-auto p-3">
            <GoogleLogin />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <Outlet />
        </main>
      </div>
    </div>
    </>
  )
}

