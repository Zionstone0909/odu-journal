import {
  FileText,
  Inbox,
  CheckCircle,
  XCircle,
  Clock,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
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

const navItems = [
  { title: "Dashboard", url: "/manuscript-center", icon: LayoutDashboard },
  { title: "All Submissions", url: "/manuscript-center/submissions", icon: Inbox },
  { title: "Under Review", url: "/manuscript-center/under-review", icon: Clock },
  { title: "Accepted", url: "/manuscript-center/accepted", icon: CheckCircle },
  { title: "Rejected", url: "/manuscript-center/rejected", icon: XCircle },
  { title: "Published", url: "/manuscript-center/published", icon: FileText },
  { title: "Reviewers", url: "/manuscript-center/reviewers", icon: Users },
];

export function ManuscriptSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) =>
    path === "/manuscript-center"
      ? currentPath === path
      : currentPath.startsWith(path);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manuscripts</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/manuscript-center"}
                      className="hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
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
