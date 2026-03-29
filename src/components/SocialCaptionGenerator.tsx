import { useState, type ChangeEvent } from 'react';
import { generateSocialCaption } from '../lib/openrouter';
import {
  Sparkles,
  Loader2,
  Copy,
  CheckCheck,
  RotateCcw,
  Share2,
  AlertCircle,
  Instagram,
  Facebook,
  Linkedin,
} from 'lucide-react';

const inputClass =
  'w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm';

type PlatformId = 'instagram' | 'facebook' | 'linkedin';

const PLATFORMS: {
  id: PlatformId;
  label: string;
  icon: any;
  accent: string;
  border: string;
  badge: string;
  ring: string;
  active: string;
}[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    icon: Instagram,
    accent: 'from-pink-500/15 to-orange-500/15',
    border: 'border-pink-500/30',
    badge: 'bg-pink-500/20 text-pink-300',
    ring: 'focus:ring-pink-500/50',
    active: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: Facebook,
    accent: 'from-blue-500/15 to-indigo-500/15',
    border: 'border-blue-500/30',
    badge: 'bg-blue-500/20 text-blue-300',
    ring: 'focus:ring-blue-500/50',
    active: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: Linkedin,
    accent: 'from-sky-500/15 to-cyan-500/15',
    border: 'border-sky-500/30',
    badge: 'bg-sky-500/20 text-sky-300',
    ring: 'focus:ring-sky-500/50',
    active: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
  },
];

const INITIAL_FORM = {
  address: '',
  bedrooms: '',
  bathrooms: '',
  sqft: '',
  price: '',
  highlights: '',
};

export default function SocialCaptionGenerator() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [platform, setPlatform] = useState<PlatformId>('instagram');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const activePlatform = PLATFORMS.find((p) => p.id === platform) ?? PLATFORMS[0];

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

      const caption = await generateSocialCaption(
        {
          address: form.address,
          bedrooms: form.bedrooms || 'N/A',
          bathrooms: form.bathrooms || 'N/A',
          sqft: form.sqft || 'N/A',
          price: form.price || 0,
          highlights,
        },
        platform,
      );

      setResult(caption);
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
        {/* Platform selector */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h2 className="text-sm font-medium text-white/60 mb-3 uppercase tracking-wider">
            Platform
          </h2>
          <div className="flex gap-2">
            {PLATFORMS.map((p) => {
              const Icon = p.icon;
              const isActive = platform === p.id;
              return (
                <button
                  key={p.id}
                  id={`scg-platform-${p.id}`}
                  onClick={() => {
                    setPlatform(p.id);
                    setResult('');
                    setError('');
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium border transition-all ${
                    isActive
                      ? p.active
                      : 'border-white/10 text-white/50 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={16} />
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Property details */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Share2 size={20} className="text-pink-400" />
            Property Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Property Address <span className="text-rose-400">*</span>
              </label>
              <input
                id="scg-address"
                name="address"
                type="text"
                value={form.address}
                onChange={handleChange}
                placeholder="e.g. 123 Maple Street, Austin, TX 78701"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Bedrooms</label>
                <input
                  id="scg-bedrooms"
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
                  id="scg-bathrooms"
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Sq Ft</label>
                <input
                  id="scg-sqft"
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
                  id="scg-price"
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

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">
                Highlights{' '}
                <span className="text-white/40 font-normal">(comma-separated)</span>
              </label>
              <input
                id="scg-highlights"
                name="highlights"
                type="text"
                value={form.highlights}
                onChange={handleChange}
                placeholder="e.g. pool, mountain view, new kitchen"
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
            id="scg-generate-btn"
            onClick={handleGenerate}
            disabled={loading}
            className="flex-1 py-4 px-6 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Caption
              </>
            )}
          </button>

          {(result || error) && (
            <button
              id="scg-reset-btn"
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
              <Share2 size={48} className="mx-auto mb-4 opacity-40" />
              <p className="font-medium text-white/50">Your social caption will appear here</p>
              <p className="text-sm mt-1 text-white/30">
                Select a platform and click "Generate"
              </p>
            </div>
          </div>
        ) : (
          <div
            className={`bg-gradient-to-br ${activePlatform.accent} ${activePlatform.border} border backdrop-blur-sm rounded-2xl p-6 h-full flex flex-col`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${activePlatform.badge}`}>
                {(() => {
                  const Icon = activePlatform.icon;
                  return <Icon size={14} />;
                })()}
                {activePlatform.label} Caption
              </div>
              <button
                id="scg-copy-btn"
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
              id="scg-result-textarea"
              readOnly
              value={loading ? '' : result}
              placeholder={loading ? 'Writing your caption…' : ''}
              rows={14}
              className="flex-1 w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm leading-relaxed placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-all"
            />

            {loading && (
              <div className="flex items-center gap-2 mt-3 text-pink-400 text-sm">
                <Loader2 size={14} className="animate-spin" />
                AI is writing your {activePlatform.label} caption…
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
