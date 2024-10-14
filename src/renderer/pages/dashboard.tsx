import React, { useEffect, useState } from "react"
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Link,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react"

import { Badge } from "@/renderer/components/ui/badge"
import { Button } from "@/renderer/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/renderer/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/renderer/components/ui/dropdown-menu"
import { Input } from "@/renderer/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/renderer/components/ui/sheet"
import { GoogleLogin } from "../components/GoogleLogin"
import { Outlet, useNavigate } from "react-router-dom";
import { useGapi } from "../hooks/gapi"

export const description =
  "A products dashboard with a sidebar navigation and a main content area. The dashboard has a header with a search input and a user menu. The sidebar has a logo, navigation links, and a card with a call to action. The main content area shows an empty state with a call to action."




  
export function Dashboard() {
    const [files, setFiles] = useState([])
    const navigate = useNavigate();
    const {gapi}: any = useGapi()
    const listFiles = async () => {
        const accessToken = gapi.auth.getToken()?.access_token;
    
        if (!accessToken) {
          alert("No access Token Found.");
          return;
        }
    
        try {
          const response = await gapi.client.drive.files.list({
            'pageSize': 10,
            'q': "mimeType = 'text/markdown'",
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
                {files.map (file => <button onClick={() => navigate(`/${file.id}`)} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">{file.name}</button>)}
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
