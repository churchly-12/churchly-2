import AdminTopBar from './AdminTopBar';

const AdminLayout = ({ children }) => {
  return (
    <>
      <AdminTopBar />
      <div className="min-h-screen bg-slate-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {children}
        </div>
      </div>
    </>
  );
};

export default AdminLayout;