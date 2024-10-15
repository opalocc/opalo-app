import React, { useEffect, useState } from "react"
import {
  Package2,
} from "lucide-react"

import { GoogleLogin } from "../components/GoogleLogin"
import { Outlet, useNavigate } from "react-router-dom";
import { useGapi } from "../hooks/gapi"
import { TreeView, TreeDataItem } from '../components/ui/tree-view';

const data: TreeDataItem[] = [
  {
    id: '1',
    name: 'Item 1',
    children: [
      {
        id: '2',
        name: 'Item 1.1',
        children: [
          {
            id: '3',
            name: 'Item 1.1.1',
          },
          {
            id: '4',
            name: 'Item 1.1.2',
          },
        ],
      },
      {
        id: '5',
        name: 'Item 1.2',
      },
    ],
  },
  {
    id: '6',
    name: 'Item 2',
  },
];

  
export function Dashboard() {
    const [files, setFiles] = useState([])
    const [tree, setTree] = useState([])
    const navigate = useNavigate();
    const {gapi}: any = useGapi();
    
    function buildTree(elements: any) {
      const tree: any[] = [];
      const map: any = {};
  
      // Create a map for each element
      elements.forEach((element: any) => {
          map[element.id] = { ...element, children: [] };
      });
  
      // Build the tree structure
      elements.forEach((element: any) => {
          const parentIds = element.parents;
          parentIds.forEach((parentId: any) => {
              if (map[parentId]) {
                  map[parentId].children.push(map[element.id]);
              } else {
                  // If no parent exists in the map, it might be a top-level item
                  tree.push(map[element.id]);
              }
          });
      });
      return tree
  }
  
    async function listAllFiles(): Promise<void> {
      let files: any[] = [];
      let nextPageToken: string | undefined = '';
  
      // Fetch all files and folders
      while( nextPageToken !== undefined && nextPageToken !== null ) {
        // Explicitly typing the response
        const resp = await gapi.client.drive.files.list( {
          pageSize: 1000, // Set page size as needed
          'q': "trashed = false and (mimeType = 'text/markdown' or mimeType = 'application/vnd.google-apps.folder')",
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
      
      // Build tree from the list of files
      const tree = buildTree( files );
      // Display the tree structure
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
        //console.log(response.result);
        
      } catch (error) {
        console.error(error);
      }
    }
    const listFiles = async () => {
        const accessToken = gapi.auth.getToken()?.access_token;
    
        if (!accessToken) {
          alert("No access Token Found.");
          return;
        }
    
        try {
          const response = await gapi.client.drive.files.list({
            'pageSize': 10,
            'q': "trashed = false and mimeType = 'text/markdown'",
            'fields': "nextPageToken, files(id, name, mimeType)",
          });
          setFiles(response.result.files);
        } catch (error) {
          console.error(error);
        }
      };
    
    useEffect(() => {
        if (!gapi)
            return
        listFiles()
        listAllFiles()
    },[gapi])
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <a href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">My Folder</span>
            </a>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">

                <TreeView data={tree} onSelectChange={(item: TreeDataItem) => navigate(`/${item.id}`)}/>;  
            </nav>
          </div>
          <div className="mt-auto p-4">
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
