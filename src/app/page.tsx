'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function App() {
  const [view, setView] = useState<'search' | 'download'>('search');
  const [name, setName] = useState('');
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Asset configurations derived from the provided design states
  const ASSETS = {
    search: {
      splash: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-03-30/GaqLJKsytp.png',
      bg: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-03-30/q0hJ2Pzc8U.png',
      star: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-03-30/gv6SQyYr4R.png',
      star4: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-03-30/boo3u1AWtH.png',
    },
    download: {
      splash: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-03-30/QiWL1fuxOm.png',
      bg: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-03-30/SPQp1fGspV.png',
      star: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-03-30/6G7Evr34X7.png',
      star4: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-03-30/ZgVfw5LtW1.png',
    }
  };

  const STATIC_ASSETS = {
    logo: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-03-30/FaGt4iHiw9.png',
    certificatePreview: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-03-30/ifn5S7vxJ0.png'
  };

  const handleSearch = async () => {
    if (name.trim()) {
      setIsLoading(true);
      try {
        // Query the 'certificates' table for a name matching the input
        const { data, error } = await supabase
          .from('certificates')
          .select('file_path')
          .ilike('name', name.trim())
          .single();

        if (data && !error) {
          // Construct the public URL from Supabase Storage
          const { data: publicData } = supabase.storage
            .from('certificates')
            .getPublicUrl(data.file_path);
          
          setCertificateUrl(publicData.publicUrl);
          setView('download');
        } else {
          alert('No certificate found for this name.');
        }
      } catch (err) {
        console.error('Error fetching certificate:', err);
        alert('An error occurred during the search.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDownload = async () => {
    if (certificateUrl) {
      try {
        const response = await fetch(certificateUrl);
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${name.replace(/\s+/g, '_')}_Certificate.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error('Download failed:', err);
        alert('Failed to download image.');
      }
    }
    // Return to original state after "download" action
    setView('search');
    setName('');
    setCertificateUrl(null);
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center py-8">
      {/* Inject Google Font required for the design */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;600&display=swap');
        .font-poppins { font-family: 'Poppins', sans-serif; }
      `}} />

      {/* Main Container simulating the mobile screen dimensions provided */}
      <div className="relative w-[402px] h-[874px] rounded-[40px] overflow-hidden shadow-2xl border-[6px] border-[#1a1125] bg-gradient-to-b from-[#291c39] to-[#030007] font-poppins box-content">
        
        {/* Background Base Pattern */}
        <div 
          className="absolute w-[664px] h-[592px] top-[8px] left-0 bg-no-repeat bg-center bg-cover transition-all duration-700 opacity-60 pointer-events-none"
          style={{ backgroundImage: `url(${ASSETS[view].bg})` }}
        />

        {/* Top-left decorative splash */}
        <div 
          className="absolute w-[346px] h-[491px] -top-[246px] -left-[145px] z-[2] bg-no-repeat bg-center bg-cover transition-all duration-700 pointer-events-none"
          style={{ backgroundImage: `url(${ASSETS[view].splash})` }}
        />

        {/* "Your Story" Logo - Visually floats at the top */}
        <div 
          className={`absolute w-[157px] h-[90px] top-[20px] left-[200px] z-[15] bg-no-repeat bg-center bg-cover transition-opacity duration-500 pointer-events-none ${view === 'search' ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${STATIC_ASSETS.logo})` }}
        />

        {/* --- THE PURPLE CARD (.rectangle) --- */}
        <div 
          className={`absolute left-[-100px] w-[502px] bg-[#e1d5fd] z-[40] rounded-[106px] transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
            view === 'search' ? 'top-[396px] h-[570px]' : 'top-[280px] h-[755px]'
          }`}
        >
          {/* Card Title (Common to both views) */}
          <div className="absolute top-[28px] left-[138px] text-black font-semibold text-[29px] leading-[42.55px] tracking-[-0.29px]">
            Download the
          </div>
          <div className="absolute top-[55px] left-[139px] text-black font-semibold text-[29px] leading-[42.55px] tracking-[-0.29px]">
            certificate now!
          </div>

          {/* Dynamic Content of the Card */}
          {view === 'search' ? (
            <div className="animate-in fade-in duration-500">
              {/* Input Label */}
              <div className="absolute top-[105px] left-[142px] text-black font-light text-[11px] leading-[16.14px] tracking-[-0.11px]">
                search your name
              </div>

              {/* Input Field (.rectangle-2) */}
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="absolute top-[127px] left-[139px] w-[168px] h-[34px] bg-[#824cc1]/[0.57] rounded-[11px] z-[11] px-3 text-black font-poppins text-xs outline-none focus:ring-2 focus:ring-[#824cc1]"
              />

              {/* Search Button (.rectangle-3) */}
              <button
                onClick={handleSearch}
                disabled={!name.trim() || isLoading}
                className={`absolute top-[172px] left-[139px] w-[77px] h-[21px] bg-[#824cc1] rounded-[8px] z-[12] flex items-center justify-center text-white font-light text-[11px] transition-all ${
                  name.trim() && !isLoading ? 'hover:bg-[#6a3d9e] cursor-pointer' : 'opacity-60 cursor-not-allowed'
                }`}
              >
                {isLoading ? '...' : 'search'}
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              {/* Certificate Container (.rectangle-2 layout equivalent) */}
              <div className="absolute top-[127px] left-[139px] w-[216px] h-[150px] bg-[#824cc1]/[0.57] rounded-[11px] z-[9]" />

              {/* Actual Certificate Image Preview */}
              <div 
                className="absolute top-[137px] left-[151px] w-[191px] h-[129px] z-[13] rounded-[13px] bg-no-repeat bg-center bg-cover shadow-lg"
                style={{ backgroundImage: `url(${certificateUrl || STATIC_ASSETS.certificatePreview})` }}
              />

              {/* Download Button (.rectangle-3) */}
              <button
                onClick={handleDownload}
                className="absolute top-[292px] left-[139px] w-[77px] h-[21px] bg-[#824cc1] rounded-[8px] z-[12] flex items-center justify-center text-white font-light text-[11px] hover:bg-[#6a3d9e] transition-all cursor-pointer shadow-md active:scale-95"
              >
                download
              </button>
            </div>
          )}

          {/* Star decoration inside the card - Swaps asset but keeps relative position */}
          <div 
            className={`absolute top-[188px] left-[120px] w-[168px] h-[122px] bg-no-repeat bg-center bg-cover pointer-events-none transition-all duration-700 ${
              view === 'search' ? 'z-[45] opacity-100' : 'z-[10] opacity-0'
            }`}
            style={{ backgroundImage: `url(${ASSETS[view].star})` }}
          />

          {/* Floating Robot GIF nested inside the card for "between" layering */}
          <img 
            src="/robot.gif"
            alt="Robot mascot"
            className={`absolute w-[240px] h-[328px] z-[5] object-contain pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
              view === 'search' ? 'top-[124px] left-[240px]' : 'top-[140px] left-[280px]'
            }`}
          />
        </div>

        {/* --- FOREGROUND DECORATIONS --- */}

        {/* Blurred Bottom Glow Element (.star-4) */}
        <div 
          className={`absolute w-[328px] h-[311px] left-[-125px] z-[50] blur-[6.7px] bg-no-repeat bg-center bg-cover pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
            view === 'search' ? 'top-[673px]' : 'top-[557px]'
          }`}
          style={{ backgroundImage: `url(${ASSETS[view].star4})` }}
        />

      </div>
    </div>
  );
}
