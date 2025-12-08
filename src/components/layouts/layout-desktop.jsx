export default function DesktopLayout({ children }) {
  return (
    <div className="desktop-layout">
      <aside>Sidebar</aside>
      <div className="content">
        <header>Desktop Header</header>
        <main>{children}</main>
      </div>
    </div>
  );
}
