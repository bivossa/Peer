import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Connections from "@/pages/Connections";
import Forum from "@/pages/Forum";
import Courses from "@/pages/Courses";
import Professionals from "@/pages/Professionals";
import NotFound from "@/pages/not-found";

function App() {
  const [location] = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Layout>
          <Switch>
            <Route path="/" component={Connections} />
            <Route path="/forum" component={Forum} />
            <Route path="/courses" component={Courses} />
            <Route path="/professionals" component={Professionals} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
