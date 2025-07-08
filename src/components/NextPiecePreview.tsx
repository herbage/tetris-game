import { Piece } from '@/lib/tetris-types';

interface NextPiecePreviewProps {
  piece: Piece | null;
}

export default function NextPiecePreview({ piece }: NextPiecePreviewProps) {
  if (!piece) return null;

  const getCellColor = (value: number) => {
    const colors = {
      0: 'bg-gray-700',
      1: 'bg-cyan-500',     // I piece
      2: 'bg-yellow-500',   // O piece
      3: 'bg-purple-500',   // T piece
      4: 'bg-green-500',    // S piece
      5: 'bg-red-500',      // Z piece
      6: 'bg-blue-500',     // J piece
      7: 'bg-orange-500',   // L piece
    };
    return colors[value as keyof typeof colors] || 'bg-gray-700';
  };

  return (
    <div className="bg-gray-700 p-4 rounded-lg shadow-lg border border-gray-600">
      <h3 className="text-white text-lg font-semibold mb-3">Next</h3>
      <div className="grid gap-0.5 justify-center" style={{ gridTemplateColumns: `repeat(${piece.shape[0].length}, 1fr)` }}>
        {piece.shape.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className={`w-6 h-6 ${getCellColor(cell)} border border-gray-600 transition-all duration-200 ${
                cell !== 0 ? 'shadow-sm' : ''
              }`}
              style={{
                boxShadow: cell !== 0 ? 'inset 0 1px 2px rgba(255,255,255,0.1)' : undefined
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}