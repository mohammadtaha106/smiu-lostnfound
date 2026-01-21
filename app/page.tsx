"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { StatsStrip } from "@/components/StatsStrip";
import { ItemFeed } from "@/components/ItemFeed";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-white">
      <Navbar onSearch={setSearchQuery} />
      <main>
        <HeroSection />
        <StatsStrip />
        <ItemFeed searchQuery={searchQuery} />
      </main>

      {/* Footer */}
      <footer className="bg-smiu-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="https://www.smiu.edu.pk/themes/smiu/images/13254460_710745915734761_8157428650049174152_n.png"
                  alt="SMIU Logo"
                  className="h-10 w-auto object-contain brightness-0 invert"
                />
                <div>
                  <span className="font-bold text-white text-lg">SMIU</span>
                  <span className="text-smiu-gold text-lg font-medium ml-1">
                    Lost & Found
                  </span>
                </div>
              </div>
              <p className="text-white/70 text-sm">
                A trusted platform for the SMIU community to report and find lost
                belongings.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-smiu-gold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>
                  <a href="/" className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/report" className="hover:text-white transition-colors">
                    Report an Item
                  </a>
                </li>
                <li>
                  <a
                    href="https://smiu.edu.pk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    SMIU Official Website
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-smiu-gold mb-4">Contact</h3>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>Sindh Madressatul Islam University</li>
                <li>Aiwan-e-Tijarat Road, Karachi</li>
                <li>info@smiu.edu.pk</li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/50 text-sm">
            <p>
              © {new Date().getFullYear()} SMIU Lost & Found. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
