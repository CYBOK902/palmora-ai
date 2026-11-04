import React from 'react';
import { PalmReading } from '../types/palm';
import { History, X, Trash2, ArrowRight, Hand, Calendar, Sparkles } from 'lucide-react';

export interface SavedReadingRecord {
  id: string;
  timestamp: string;
  imageUrl: string;
  dominantHand: 'left' | 'right';
  reading: PalmReading;
}

interface SavedReadingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedReadings: SavedReadingRecord[];
  onSelectReading: (record: SavedReadingRecord) => void;
  onDeleteReading: (id: string) => void;
  onClearAll: () => void;
}

export const SavedReadingsDrawer: React.FC<SavedReadingsDrawerProps> = ({
  isOpen,
  onClose,
  savedReadings,
  onSelectReading,
  onDeleteReading,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-[#090b1c] border-l border-amber-500/20 h-full p-6 flex flex-col justify-between shadow-2xl animate-slideLeft">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
                <History className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-cinzel">
                  Reading History
                </h3>
                <p className="text-[11px] text-slate-400">
                  {savedReadings.length} reading{savedReadings.length === 1 ? '' : 's'} saved on this device
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List of saved readings */}
          <div className="mt-6 space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            {savedReadings.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs space-y-2">
                <Sparkles className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                <p>No palm readings saved yet.</p>
                <p className="text-[11px] text-slate-600">
                  Completed readings will automatically appear here for easy recall.
                </p>
              </div>
            ) : (
              savedReadings.map((record) => (
                <div
                  key={record.id}
                  onClick={() => {
                    onSelectReading(record);
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-amber-500/40 transition-all cursor-pointer group flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={record.imageUrl}
                      alt="Palm thumbnail"
                      className="w-12 h-14 object-cover rounded-lg border border-slate-800 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white font-cinzel">
                          {record.reading.handShape.element} Hand
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-medium">
                          {record.dominantHand.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{record.timestamp}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteReading(record.id);
                      }}
                      title="Delete record"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        {savedReadings.length > 0 && (
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All History</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white"
            >
              Close
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
