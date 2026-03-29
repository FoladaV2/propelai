import { useState, type ChangeEvent } from 'react';
import { generateListingDescription } from '../lib/openrouter';
import {
  Sparkles,
  Loader2,
  Copy,
  CheckCheck,
  RotateCcw,
  FileText,
  AlertCircle,
} from 'lucide-react';

const inputClass =
  'w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm';

const INITIAL_FORM = {
  address: '',
  bedrooms: '',
  bathrooms: '',
  sqft: '',
  price: '',
  highlights: '',
};

export default function ListingDescriptionGenerator() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleGenerate = async () => {
    if (!form.address.trim()) {
      setError('Please enter the property address.');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const highlights = form.highlights
        ? form.highlights.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      const description = await generateListingDescription({
        address: form.address,
        bedrooms: form.bedrooms || 'N/A',
        bathrooms: form.bathrooms || 'N/A',
        sqft: form.sqft || 'N/A',
        price: form.price || 0,
        highlights,
      });

      setResult(description);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setResult('');
    setError('');
    setCopied(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* ── Left: Input Form ──────────────────────────────────────── */}
      <div className="space-y-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <FileText size={20} className="text-indigo-400" />
            Property Details
          </h2>

          <div className="space-y-4">
            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Property Address <span className="text-rose-400">*</span>
              </label>
              <input
                id="ldg-address"
                name="address"
                type="text"
                value={form.address}
                onChange={handleChange}
                placeholder="e.g. 123 Maple Street, Austin, TX 78701"
                className={inputClass}
              />
            </div>

            {/* Bedrooms / Bathrooms */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Bedrooms</label>
                <input
                  id="ldg-bedrooms"
                  name="bedrooms"
                  type="number"
                  min="0"
                  value={form.bedrooms}
                  onChange={handleChange}
                  placeholder="3"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Bathrooms</label>
                <input
                  id="ldg-bathrooms"
                  name="bathrooms"
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.bathrooms}
                  onChange={handleChange}
                  placeholder="2"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Sqft / Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Sq Ft</label>
                <input
                  id="ldg-sqft"
                  name="sqft"
                  type="number"
                  min="0"
                  value={form.sqft}
                  onChange={handleChange}
                  placeholder="1850"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Price ($)</label>
                <input
                  id="ldg-price"
                  name="price"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="450000"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Highlights */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Highlights{' '}
                <span className="text-white/40 font-normal">(comma-separated)</span>
              </label>
              <input
                id="ldg-highlights"
                name="highlights"
                type="text"
                value={form.highlights}
                onChange={handleChange}
                placeholder="e.g. pool, mountain view, new kitchen, hardwood floors"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3">
            <AlertCircle size={16} className="text-rose-400 mt-0.5 shrink-0" />
            <p className="text-rose-300 text-sm">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            id="ldg-generate-btn"
            onClick={handleGenerate}
            disabled={loading}
            className="flex-1 py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Description
              </>
            )}
          </button>

          {(result || error) && (
            <button
              id="ldg-reset-btn"
              onClick={handleReset}
              className="py-4 px-4 bg-white/10 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all"
              title="Reset"
            >
              <RotateCcw size={18} />
            </button>
          )}
        </div>
      </div>

      {/* ── Right: Result ─────────────────────────────────────────── */}
      <div className="h-full">
        {!result && !loading ? (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-10 h-full min-h-72 flex items-center justify-center">
            <div className="text-center text-white/30">
              <FileText size={48} className="mx-auto mb-4 opacity-40" />
              <p className="font-medium text-white/50">Your listing description will appear here</p>
              <p className="text-sm mt-1 text-white/30">Fill in the details and click "Generate"</p>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/25 backdrop-blur-sm rounded-2xl p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/20 text-indigo-300">
                <FileText size={14} />
                Listing Description
              </div>
              <button
                id="ldg-copy-btn"
                onClick={handleCopy}
                disabled={!result}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/60 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 rounded-lg transition-all disabled:opacity-30"
              >
                {copied ? (
                  <>
                    <CheckCheck size={13} className="text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    Copy
                  </>
                )}
              </button>
            </div>

            <textarea
              id="ldg-result-textarea"
              readOnly
              value={loading ? '' : result}
              placeholder={loading ? 'Writing your listing description…' : ''}
              rows={14}
              className="flex-1 w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm leading-relaxed placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-all"
            />

            {loading && (
              <div className="flex items-center gap-2 mt-3 text-indigo-400 text-sm">
                <Loader2 size={14} className="animate-spin" />
                AI is crafting your description…
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
