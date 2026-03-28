import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Video, HelpCircle, Download, ExternalLink, Activity } from 'lucide-react';
import { resourceService, BASE_URL } from '../services/home';

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await resourceService.getAll();
      console.log("Resources loaded from backend:", data);

      const results = Array.isArray(data) ? data : (data.results || []);
      setResources(results);
    } catch (err) {
      console.error("Failed to fetch resources:", err);
      setError("Unable to load resources. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleResourceAction = async (item) => {
    // Determine if it's a PDF for forced download
    const isPdf = item.resource_type?.toLowerCase() === 'pdf';
    const targetUrl = item.file || item.link;

    if (!targetUrl) {
      console.warn("No file or link found for resource:", item);
      return;
    }

    if (isPdf) {
      try {
        let path = targetUrl;
        if (!path.startsWith('http')) {
          if (!path.startsWith('/')) path = '/' + path;
          if (!path.startsWith('/media/')) path = '/media' + path;
        }

        const fileUrl = path.startsWith('http') ? path : `${BASE_URL}${path}`;
        console.log("Fetching PDF for download:", fileUrl);

        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        // Extract clean filename
        let fileName = (path.split('/').pop() || item.title || 'document').split('?')[0];
        if (!fileName.toLowerCase().endsWith('.pdf')) fileName += '.pdf';

        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);

        // Success: track download count
        resourceService.patch(item.id, { downloads: (item.downloads || 0) + 1 });
        return;
      } catch (err) {
        console.error("Forced PDF download failed, falling back to open:", err);
        // Fallthrough to standard open
      }
    }

    // Standard action for non-PDF or fallback
    let finalPath = targetUrl;
    if (!finalPath.startsWith('http')) {
      if (!finalPath.startsWith('/')) finalPath = '/' + finalPath;
      if (!finalPath.startsWith('/media/')) finalPath = '/media' + finalPath;
    }
    const finalUrl = finalPath.startsWith('http') ? finalPath : `${BASE_URL}${finalPath}`;
    window.open(finalUrl, '_blank', 'noopener,noreferrer');

    // Track action
    resourceService.patch(item.id, { downloads: (item.downloads || 0) + 1 });
  };

  // Group resources by category
  const categories = resources.reduce((acc, res) => {
    const cat = res.category || "General Resources";
    if (!acc[cat]) {
      acc[cat] = {
        title: cat,
        items: []
      };
    }
    acc[cat].items.push(res);
    return acc;
  }, {});

  const categoryList = Object.values(categories);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Activity className="h-10 w-10 mx-auto mb-4 animate-spin text-brand-blue/30" />
        <p className="text-lg">Fetching latest sales collateral...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Resource Center</h1>
        <p className="text-slate-500 mt-2">Access training materials, product guides, and sales tools.</p>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-red-600 flex justify-between items-center">
          <p>{error}</p>
          <button onClick={fetchResources} className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold">Retry</button>
        </div>
      )}

      <section className="grid md:grid-cols-2 gap-8">
        {categoryList.length > 0 ? categoryList.map((category) => (
          <div key={category.title} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                <BookOpen className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">{category.title}</h2>
            </div>

            <div className="space-y-4">
              {category.items.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center justify-between border border-slate-50 rounded-2xl p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 group-hover:text-brand-blue transition-colors">{item.title}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase tracking-wider">
                        {item.resource_type || "File"}
                      </span>
                      {item.size && (
                        <span className="text-xs text-slate-400">{item.size}</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleResourceAction(item)}
                    className="ml-4 h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-brand-blue hover:text-white transition-all shadow-sm"
                    title="Open/Download"
                  >
                    {item.resource_type?.toLowerCase() === 'link' ? <ExternalLink className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )) : !error && (
          <div className="col-span-2 bg-white rounded-3xl border border-slate-100 p-20 text-center text-slate-400">
            <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-10" />
            <p className="text-lg font-medium">No resources found</p>
            <p className="text-sm">Check back later or upload new documents via the admin panel.</p>
          </div>
        )}
      </section>

      <section className="bg-brand-navy rounded-3xl p-10 text-white relative overflow-hidden">
        <div className="relative z-10 w-full md:w-2/3">
          <h2 className="text-2xl font-bold mb-4">Sales Enablement Links</h2>
          <p className="text-white/70 mb-8">Access internal portals and secondary tools used for daily lead management and payouts.</p>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { name: 'Sales Playbook', url: 'https://example.com/playbook' },
              { name: 'Incentive Calculator', url: 'https://example.com/calc' },
              { name: 'IT Support', url: 'https://example.com/it' },
              { name: 'Policy Directory', url: 'https://example.com/policy' }
            ].map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group"
              >
                <span className="font-medium text-sm">{link.name}</span>
                <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-brand-blue/20 to-transparent hidden md:block"></div>
        <Activity className="absolute -bottom-20 -right-20 h-80 w-80 text-white/5 rotate-12" />
      </section>
    </div>
  );
}
