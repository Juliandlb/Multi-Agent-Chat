const ChatHeader = () => (
  <header className="p-5 border-b border-blue-100 flex items-center gap-3 bg-white rounded-t-2xl">
    <div className="flex items-center gap-3">
      <img
        src="/MonedaLogo.jpeg"
        alt="Moneda Logo"
        className="rounded-full w-10 h-10 object-cover border border-blue-200"
      />
      <div>
        <div className="font-bold text-lg text-blue-900 leading-tight">Moneda Multi-Agent Assistant</div>
        <div className="text-xs text-blue-500">Your intelligent banking companion</div>
      </div>
    </div>
  </header>
);

export default ChatHeader;
