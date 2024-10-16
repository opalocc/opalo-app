import React, { useEffect, useState } from "react"
import {
  Folder,
  NotebookText,
  Package2,
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
import { ScrollArea } from "../components/ui/scroll-area"

  
export function Dashboard() {
    const [selectedDrive, setSelectedDrive] = useState()
    const [tree, setTree] = useState([])
    const [drives, setDrives] = useState([])
    const navigate = useNavigate();
    const {gapi}: any = useGapi();
    
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
    
    const tree = buildTree(files.map(file => ({...file, actions: [], icon: file.mimeType ==="text/markdown"? NotebookText : Folder })) );
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
  )
}
