import Sidebar from "@/components/admin/sidebar";

export const metadata = {
  title: "Admin — YH",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; }
        body { background: #F8FAFC; }

        .admin-shell {
          display: flex;
          min-height: 100vh;
          background: #F8FAFC;
        }

        .admin-sidebar-wrap {
          flex-shrink: 0;
          height: 100vh;
          position: sticky;
          top: 0;
          align-self: flex-start;
        }

        .admin-main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          background: #F8FAFC;
          min-height: 100vh;
        }

        .admin-topbar {
          height: 52px;
          border-bottom: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          padding: 0 28px;
          gap: 12px;
          background: #FFFFFF;
          position: sticky;
          top: 0;
          z-index: 50;
          flex-shrink: 0;
        }

        .admin-content {
          flex: 1;
          padding: 32px 28px;
          overflow-y: auto;
        }

        @media (max-width: 768px) {
          .admin-sidebar-wrap {
            position: fixed;
            left: 0; top: 0; bottom: 0;
            height: 100vh;
            z-index: 199;
            transform: translateX(-100%);
            transition: transform 0.22s cubic-bezier(0.4,0,0.2,1);
          }
          .admin-sidebar-wrap.open {
            transform: translateX(0);
          }
          .admin-content {
            padding: 20px 16px;
          }
          .admin-topbar {
            padding: 0 16px;
          }
        }
      `}</style>

      <div className="admin-shell">
        <div className="admin-sidebar-wrap">
          <Sidebar />
        </div>

        <div className="admin-main">
          <header className="admin-topbar">
            <div style={{ flex: 1 }} />
          </header>

          <main className="admin-content">{children}</main>
        </div>
      </div>
    </>
  );
}
