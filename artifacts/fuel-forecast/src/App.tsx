import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Graphs from "@/pages/Graphs";
import DataTable from "@/pages/DataTable";
import Forecast from "@/pages/Forecast";
import FuelCalculator from "@/pages/Calculator";
import CityFuel from "@/pages/CityFuel";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/graphs" component={Graphs} />
        <Route path="/table" component={DataTable} />
        <Route path="/forecast" component={Forecast} />
        <Route path="/calculator" component={FuelCalculator} />
        <Route path="/city" component={CityFuel} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
