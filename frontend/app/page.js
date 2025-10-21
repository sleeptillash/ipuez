'use client';

import Loader from '@/components/FoxMascot.jsx';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { semester as semesters, branch as branches } from '@/config'; // Adjust this path
// import Footer from '@/components/footer';

export default function Home() {
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const router = useRouter();

  // Auto-navigate when both branch and semester are selected
  useEffect(() => {
    if (branch && semester) {
      router.push(`/${branch.toLowerCase()}?sem=${encodeURIComponent(semester)}`);
    }
  }, [branch, semester, router]);

  return (
    <div className=" min-h-screen home  overflow-hidden text-white px-6 md:px-20 py-12 flex flex-col">
      {/* Top Header */}
      <header className="mb-12">
        <h1 className="text-2xl font-bold">
          <span className="text-orange-500">ez</span>
          <span className="text-white">IPU</span>
        </h1>
        <p className="text-[11px]">*Includes CSAM and CYBERSECURITY</p>
      </header>

      {/* Main Content */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-between flex-1 w-full">
        {/* Left Side */}
        <section className="md:w-1/2 text-center md:text-left flex flex-col items-center md:items-start">
          <h1 className="text-4xl md:text-6xl text-white/90 font-extrabold mb-4 leading-tight">
            Everything You Need — Notes, PYQs, Lectures.
          </h1>
          <p className="text-white/90 text-lg mb-10 max-w-md">
            Just select your branch and we’ll handle the rest.
          </p>
         
          <div className='sm:hidden' >
          <p className='mt-4 uppercase text-white/80'>quick link:</p>
           <div className='flex flex-row'>
          <a className='p-4   min-w-24  hover:bg-pink-950 border border-white m-4 rounded-xl mb-4 text-white/80' href='https://ipuez.vercel.app/csam?sem=Semester+3'>CSAM SEM 3</a>

          </div>
          </div> 
          {/* Dropdowns */}
          <div className="flex flex-col gap-4 w-full max-w-4xl">
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="bg-white/80 text-black p-3 rounded-md focus:outline-none"
            >
              <option value="" hidden>Select branch</option>
              {branches.map((b) => (
                <option key={b.value} value={b.value.toLowerCase()}>
                  {b.label}
                </option>
              ))}
            </select>

            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="bg-white/80 text-black p-3 rounded-md   focus:outline-none"
            >
              <option value=""  hidden >Select semester</option>
              {semesters.map((s) => (
                <option key={s.value} value={s.label}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className='hidden sm:grid'>
          <p className='mt-4 uppercase text-white/80'>quick link:</p>
           <div className='flex flex-row'>
          <a className='p-4  border border-white hover:bg-pink-950 m-4 rounded-xl mb-4 text-white/80' href='https://ipuez.vercel.app/csam?sem=Semester+3'>CSAM SEM 3</a>

          </div>
          </div>
        </section>

        {/* Right Side (Mascot) */}
        <section className="md:w-1/2 flex justify-center  mt-28">
          <Loader />
        </section>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
