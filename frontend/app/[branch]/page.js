'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Loader from '@/components/Loader';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';

const TABS = [
  'Syllabus',
  'Notes',
  'PYQs',
  'Lab',
  'Books',
  'Akash',
  'Videos',
];

const TAB_TO_ENDPOINT = {
  Syllabus: 'syllabus',
  Notes: 'notes',
  PYQs: 'pyqs',
  Lab: 'lab',
  Books: 'books',
  Akash: 'akash',
  Videos: 'videos',
};

const EMPTY_MESSAGES = {
  Syllabus: 'Syllabus is not available for this subject.',
  Notes: 'No notes are available for this subject.',
  PYQs: 'No PYQs are available for this subject.',
  Lab: 'No lab materials are available for this subject.',
  Books: 'No books are available for this subject.',
  Akash: 'No Akash notes are available for this subject.',
  Videos: 'No videos are available for this subject.',
};

function EmptyState({ message }) {
  return (
    <div className="max-w-6xl mx-auto">
      <p className="text-gray-400 text-center">{message}</p>
    </div>
  );
}

function Viewer({ item, titlePrefix = '', onBack, showBackButton = true }) {
  if (!item) return null;
  return (
    <div className="mt-6 relative max-w-4xl overflow-hidden mx-auto border border-white/40 rounded-lg p-4 bg-black/80 shadow-lg">
      <div className="flex justify-end space-x-2 mb-4 sticky top-0 bg-black/80 pt-2 z-10">
        {showBackButton && (
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-semibold"
          >
            Back
          </button>
        )}
        {item.url_download ? (
          <a
            href={item.url_download}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold"
          >
            Download
          </a>
        ) : null}
      </div>

      <div className="border rounded overflow-hidden" style={{ height: '600px' }}>
        {item.url_view ? (
          <iframe
            src={item.url_view}
            title={`${titlePrefix} Viewer - ${item.name || ''}`}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
          />
        ) : (
          <div className="p-8 text-center text-gray-300">No preview available for this item.</div>
        )}
      </div>
    </div>
  );
}

function GridPreview({ items = [], activeLabel, onOpen }) {
  return (
    <div className="max-w-6xl overflow-hidden mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onOpen(idx)}
            className="border border-white/40 hover:bg-white p-6 hover:text-black transition-all text-white font-medium rounded-lg text-center shadow-md cursor-pointer"
          >
            {item?.name || `${activeLabel} ${idx + 1}`}
          </button>
        ))}
      </div>
    </div>
  );
}

function VideoGrid({ videos = [], openIndex, setOpenIndex }) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.map((video, idx) => (
          <div key={idx} className="bg-white/5 hover:bg-white/10 rounded-lg overflow-hidden shadow-md transition-all">
            {openIndex === idx ? (
              <div className="relative">
                {video?.embedUrl ? (
                  <iframe
                    src={video.embedUrl}
                    title={video.title || `video-${idx}`}
                    width="100%"
                    height="250"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="p-6 text-center text-gray-300">No preview available for this video.</div>
                )}
              </div>
            ) : (
              <button onClick={() => setOpenIndex(idx)} className="w-full text-left">
                {video?.thumbnailUrl ? (
                  <img src={video.thumbnailUrl} alt={video.title} className="w-full h-48 object-cover rounded-t-lg" />
                ) : (
                  <div className="w-full h-48 bg-gray-900 rounded-t-lg" />
                )}
                <div className="p-4">
                  <h3 className="text-white text-lg font-semibold mb-1">{video?.title || `Video ${idx + 1}`}</h3>
                  <p className="text-gray-400 text-sm">{video?.author || ''}</p>
                </div>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function UnitsList({ units = {}, openUnit, toggleUnit }) {
  return (
    <div className="space-y-6">
      {Object.entries(units).map(([unit, content]) => (
        <div key={unit} className="border-b border-gray-800">
          <button onClick={() => toggleUnit(unit)} className="w-full flex items-center justify-between py-8">
            <span className="text-lg font-semibold tracking-wider">{unit}</span>
            <svg
              className={`w-5 h-5 text-gray-300 transform transition-transform ${openUnit === unit ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openUnit === unit && (
            <div className="pb-8 pt-2 text-gray-300 leading-relaxed whitespace-pre-line">
              <p>{content || 'Coming soon...'}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function BranchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const branch = params?.branch;
  const sem = searchParams?.get('sem');

  const [subjects, setSubjects] = useState([]);
  const [subjectsError, setSubjectsError] = useState(null);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [activeTab, setActiveTab] = useState('Syllabus');

  const [contentData, setContentData] = useState(null);
  const [contentError, setContentError] = useState(null);
  const [loadingContent, setLoadingContent] = useState(false);

  const [openNoteIndex, setOpenNoteIndex] = useState(null);
  const [openUnit, setOpenUnit] = useState(null);
  const [akashPreviewOpen, setAkashPreviewOpen] = useState(false);

  const emptyMessage = useMemo(() => EMPTY_MESSAGES[activeTab] || `${activeTab} not available for this subject.`, [activeTab]);

  const fetchAndParse = useCallback(async (url, signal) => {
    const res = await fetch(url, { signal });
    if (res.status === 404) return { data: [], empty: true };
    if (!res.ok) {
      const text = await res.text().catch(() => null);
      throw new Error(text || res.statusText || 'Fetch error');
    }
    const json = await res.json();
    if (json && typeof json === 'object' && json.error) {
      const errStr = String(json.error).toLowerCase();
      if (errStr.includes('not found')) return { data: [], empty: true };
      throw new Error(json.error);
    }
    if (json && typeof json === 'object') {
      const wrapKey = Object.keys(json).find(k => k.endsWith('_details'));
      const details = wrapKey ? json[wrapKey] : json;
      if (typeof details === 'string') {
        try {
          const parsed = JSON.parse(details);
          return { data: parsed };
        } catch (e) {
          return { data: details ? [{ name: details }] : [] };
        }
      }
      return { data: details };
    }
    return { data: json };
  }, []);

  useEffect(() => {
    if (!branch || !sem) return;
    const controller = new AbortController();
    const signal = controller.signal;

    setLoadingSubjects(true);
    setSubjectsError(null);

    (async () => {
      try {
        const url = `${API_BASE}/subjects?branch=${encodeURIComponent(branch)}&semester=${encodeURIComponent(sem)}`;
        const { data } = await fetchAndParse(url, signal);
        const list = Array.isArray(data) ? data : Array.isArray(data?.subjects) ? data.subjects : [];
        setSubjects(list || []);
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Subjects fetch error:', err);
        setSubjectsError(err?.message || 'Failed to load subjects');
        setSubjects([]);
      } finally {
        if (!signal.aborted) setLoadingSubjects(false);
      }
    })();

    return () => controller.abort();
  }, [branch, sem, fetchAndParse]);

  useEffect(() => {
    if (!selectedSubject?.id) {
      setContentData(null);
      setContentError(null);
      setLoadingContent(false);
      setOpenNoteIndex(null);
      setOpenUnit(null);
      setAkashPreviewOpen(false);
      return;
    }
    const endpoint = TAB_TO_ENDPOINT[activeTab];
    if (!endpoint) return;

    const controller = new AbortController();
    const signal = controller.signal;

    setLoadingContent(true);
    setContentError(null);

    (async () => {
      try {
        const url = `/api/proxy?endpoint=syllabus&subject_id=${encodeURIComponent(selectedSubject.id)}`;


        const { data } = await fetchAndParse(url, signal);
        const isEmptyArray = Array.isArray(data) && data.length === 0;
        if (isEmptyArray || data == null) {
          setContentData([]);
          setAkashPreviewOpen(false);
          return;
        }
        if (!Array.isArray(data) && typeof data === 'object') {
          setContentData(data);
          setAkashPreviewOpen(false);
        } else if (Array.isArray(data)) {
          setContentData(data);
          setAkashPreviewOpen(activeTab === 'Akash' && data.length > 0);
        } else {
          setContentData([]);
          setAkashPreviewOpen(false);
        }
        setOpenNoteIndex(null);
        setOpenUnit(null);
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Content fetch error:', err);
        setContentError(err?.message || `Failed to load ${activeTab}`);
        setContentData(null);
        setAkashPreviewOpen(false);
      } finally {
        if (!signal.aborted) setLoadingContent(false);
      }
    })();

    return () => controller.abort();
  }, [activeTab, selectedSubject, fetchAndParse]);

  useEffect(() => {
    if (activeTab === 'Videos' && Array.isArray(contentData) && contentData.length > 0) {
      setOpenNoteIndex(0);
    } else {
      setOpenNoteIndex(null);
    }
  }, [activeTab, contentData]);

  const resetToSubjectsList = useCallback(() => {
    setSelectedSubject(null);
    setActiveTab('Syllabus');
    setContentData(null);
    setContentError(null);
    setLoadingContent(false);
    setOpenNoteIndex(null);
    setOpenUnit(null);
    setAkashPreviewOpen(false);
  }, []);

  const handleTabClick = tab => {
    setActiveTab(tab);
    setContentData(null);
    setContentError(null);
    setOpenNoteIndex(null);
    setOpenUnit(null);
    setAkashPreviewOpen(false);
  };

  return selectedSubject ? (
    <div className="min-h-screen home overflow-hidden text-white px-6 py-10 flex flex-col">
      <div className="max-w-6xl w-full mx-auto">
        <button
          onClick={resetToSubjectsList}
          className="text-black text-sm bg-white/80 px-4 py-2 mb-6 rounded hover:bg-white w-fit"
        >
          ← Back
        </button>

        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-5xl font-bold">{selectedSubject.name}</h1>
          <p className="text-lg uppercase text-gray-300 mt-2">{branch} | {sem}</p>
        </div>

        <div className="max-w-6xl w-full mx-auto mb-8">
          <nav className="border-b rounded-xl overflow-hidden w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`px-4 py-3 text-sm font-medium text-center transition-all rounded-xl ${
                    activeTab === tab ? 'bg-white text-black' : 'bg-transparent text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {loadingContent ? (
          <Loader />
        ) : contentError ? (
          <p className="text-red-500">{contentError}</p>
        ) : ['Notes', 'PYQs', 'Lab', 'Books'].includes(activeTab) ? (
          Array.isArray(contentData) && contentData.length > 0 ? (
            openNoteIndex !== null ? (
              <Viewer
                item={contentData[openNoteIndex]}
                titlePrefix={activeTab}
                onBack={() => setOpenNoteIndex(null)}
                showBackButton={true}
              />
            ) : (
              <GridPreview items={contentData} activeLabel={activeTab} onOpen={idx => setOpenNoteIndex(idx)} />
            )
          ) : (
            <EmptyState message={emptyMessage} />
          )
        ) : activeTab === 'Akash' && akashPreviewOpen ? (
          <Viewer
            item={Array.isArray(contentData) ? contentData[0] : null}
            titlePrefix={'Akash'}
            onBack={() => setAkashPreviewOpen(false)}
            showBackButton={false}
          />
        ) : activeTab === 'Videos' ? (
          Array.isArray(contentData) && contentData.length > 0 ? (
            <VideoGrid videos={contentData} openIndex={openNoteIndex} setOpenIndex={setOpenNoteIndex} />
          ) : (
            <EmptyState message={emptyMessage} />
          )
        ) : contentData && typeof contentData === 'object' ? (
          <UnitsList units={contentData} openUnit={openUnit} toggleUnit={u => setOpenUnit(openUnit === u ? null : u)} />
        ) : (
          <EmptyState message={emptyMessage} />
        )}
      </div>
    </div>
  ) : (
    <div className="min-h-screen home overflow-hidden text-white px-6 py-10 flex flex-col">
      <div className="max-w-6xl w-full mx-auto">
        <button onClick={() => router.back()} className="text-black text-sm bg-white/80 px-4 py-2 mb-6 rounded hover:bg-white w-fit">← Back</button>
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-5xl font-bold uppercase text-white">{branch || 'Not selected'}</h1>
          <p className="text-lg text-gray-300 uppercase mt-2">{sem || 'Not selected'}</p>
        </div>
        {loadingSubjects ? (
          <Loader />
        ) : subjectsError ? (
          <p className="text-red-500 text-center">{subjectsError}</p>
        ) : subjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {subjects.map(subj => (
              <div
                key={subj.id}
                onClick={() => {
                  setSelectedSubject(subj);
                  setActiveTab('Syllabus');
                  setContentData(null);
                  setContentError(null);
                  setOpenNoteIndex(null);
                  setOpenUnit(null);
                  setAkashPreviewOpen(false);
                }}
                className="border border-white/40 hover:bg-white hover:text-black transition-all text-white font-medium p-6 rounded-lg text-center shadow-md cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setSelectedSubject(subj)}
              >
                {subj.name}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-gray-400"></p>
        )}
      </div>
    </div>
  );
}
