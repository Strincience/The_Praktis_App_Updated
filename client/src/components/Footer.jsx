export default function Footer() {
  return (
    <footer className="bg-[#1F1F1F] text-white py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
            <span className="text-white font-heading font-bold text-sm">P</span>
          </div>
          <span className="font-heading font-bold text-lg">Praktis</span>
        </div>
        <p className="text-gray-500 text-sm text-center">
          "Creativity is not talent. Creativity is practiced."  Praktis
        </p>
        <p className="text-gray-600 text-sm">© {new Date().getFullYear()} Praktis. All rights reserved.</p>
      </div>
    </footer>
  )
}
