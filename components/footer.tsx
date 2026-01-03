export function Footer() {
  return (
    // <footer className="w-full border-t border-primary/10 bg-transparent backdrop-blur-sm">
    //   <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
    //     <div className="flex flex-col items-center justify-center gap-2">
    //       <p className="text-center text-sm text-muted-foreground/80">
    //         © {new Date().getFullYear()} Finac. All rights reserved.
    //       </p>
    //       <p className="text-center text-sm text-muted-foreground/70">
    //         Built with Next.js, Tailwind & shadcn/ui
    //       </p>
    //     </div>
    //   </div>
    // </footer>
    <footer className="p-5 pt-8 text-sm text-center text-muted-foreground">
      &copy; {new Date().getFullYear()} Finac. Open-source. Made with <span role="img" aria-label="love">❤️</span>.
    </footer>
  );
}
