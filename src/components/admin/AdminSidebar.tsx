import { Users, FileText, UserCheck, Upload, BookOpen, Library } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface AdminSidebarProps {
  activeTab: "users" | "articles" | "approvals" | "bulk-upload" | "board-members" | "journals";
  onTabChange: (tab: "users" | "articles" | "approvals" | "bulk-upload" | "board-members" | "journals") => void;
}

const navItems = [
  { title: "User Management", tab: "users" as const, icon: Users },
  { title: "User Approvals", tab: "approvals" as const, icon: UserCheck },
  { title: "Article Access", tab: "articles" as const, icon: FileText },
  { title: "Board Members", tab: "board-members" as const, icon: BookOpen },
  { title: "Journals", tab: "journals" as const, icon: Library },
  { title: "Bulk Upload", tab: "bulk-upload" as const, icon: Upload },
];

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.tab}>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={() => onTabChange(item.tab)}
                      className={`flex items-center w-full px-2 py-1.5 rounded text-sm hover:bg-muted/50 ${
                        activeTab === item.tab ? "bg-muted text-primary font-medium" : ""
                      }`}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
