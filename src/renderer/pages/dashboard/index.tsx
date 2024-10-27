import React, { useEffect, useState } from "react"
import {
  CircleUser, 
  Folder,
  NotebookText,
  PlusIcon,
  Search,
  Menu,
} from "lucide-react"
import { GoogleLogin } from "@/renderer/components/GoogleLogin"
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useCloudStorage } from "@/renderer/providers/CloudStorageProvider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/renderer/components/ui/dropdown-menu"
import { Button } from "@/renderer/components/ui/button"
import { Input } from "@/renderer/components/ui/input"

import { Sheet, SheetContent, SheetTrigger } from "@/renderer/components/ui/sheet"
import { useTheme } from "@/renderer/providers/ThemeProvider";
import { SearchDialog } from "@/renderer/components/SearchDialog";
import { RenameDialog } from "@/renderer/components/RenameDialog";
import { Navi } from "@/renderer/components/Navigator";

export function Dashboard() {

    const params: any = useParams()
    const {theme, setTheme} = useTheme();
    const [selectedDrive, setSelectedDrive] = useState<string>()
    const [openSearch, setOpenSearch] = useState<boolean>(false)
    const [tree, setTree] = useState([])
    const [dialogData, setDialogData] = useState<any>();
    const [drives, setDrives] = useState([])
    const navigate = useNavigate();
    const {loaded, isSignedIn, rename, remove, add, listAll, listFolders}: any = useCloudStorage();
    const [referencesList, setReferencesList] = useState<any[]>()

    const Rename = async (event: any) => {
      event.preventDefault(); 
      await rename({id: dialogData.id, name: event.target[0].value}, selectedDrive)
      setDialogData(undefined)
      refreshFileTree(selectedDrive)
    }

    const Remove = async (event: Event, file: any) => {
      await remove(file, selectedDrive)
      refreshFileTree(selectedDrive)
      event.preventDefault()
    }

    const addFile = async (event: Event, file: any) => {
      await add.file(file, selectedDrive)
      refreshFileTree(selectedDrive)
      event.preventDefault()
    }

    const addFolder = async (event: Event, file: any) => {
      await add.folder(file, selectedDrive)
      refreshFileTree(selectedDrive)
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

  async function refreshFileTree(selectedDrive?: string): Promise<void> {
    const files = (await listAll(selectedDrive)).map((file: any) => ({...file, actions: [(
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
    icon: file.mimeType ==="text/markdown"? NotebookText : Folder }))
    
    const tree = buildTree(files);
    setTree(tree);
    setReferencesList(files.map((file: any) => ({name: file.name, id: file.id})))
  }
  
  useEffect(() => {
    (async () => {
      if(!(await isSignedIn()))
        return navigate('/login')

      setDrives(await listFolders())
      refreshFileTree()
    })()
  },[loaded])


  useEffect(() => {
    if (!loaded)
        return
    refreshFileTree(selectedDrive)
  },[selectedDrive])

  return (
    <>
    <SearchDialog selectedDrive={selectedDrive} open={openSearch} setOpen={setOpenSearch} />
    <RenameDialog dialogData={dialogData} setDialogData={setDialogData} onRename={Rename} />
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <Navi drives={drives} setSelectedDrive={setSelectedDrive} navigate={navigate} id={params.id} tree={tree} />
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <div className="grid gap-2 text-lg font-medium">
              <Navi drives={drives} setSelectedDrive={setSelectedDrive} navigate={navigate} id={params.id} tree={tree} />
                </div>
            </SheetContent>
          </Sheet>
      <div className="w-full flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  onClick={() => setOpenSearch(true)}
                  type="search"
                  placeholder="Search..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setTheme(theme === "light"? "dark" : "light")}>Toggle Theme</DropdownMenuItem>
              <DropdownMenuItem><GoogleLogin onLogout={() => navigate('/')} /></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <Outlet context={{referencesList}} />
        </main>
      </div>
    </div>
    </>
  )
}

