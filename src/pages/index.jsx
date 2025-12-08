import DashboardLayout from '@/components/layouts/dashboard-layout';
import HomeDashboard from '@/components/dashboard/home-dashboard';

export default function Home() {
  return (
    <DashboardLayout>
      <HomeDashboard />
    </DashboardLayout>
  );
}
