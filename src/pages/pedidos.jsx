import DashboardLayout from '@/components/layouts/dashboard-layout';
import OrdersDashboard from '@/components/dashboard/orders-dashboard';

export default function Pedidos() {
  return (
    <DashboardLayout>
      <OrdersDashboard />
    </DashboardLayout>
  );
}



