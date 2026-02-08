import React from 'react';
import { Drawer } from 'antd';

const REFERENCE_SHAPES = [
  { shape: 'Circle', formulas: ['A = πr²', 'C = 2πr'], svg: '<circle cx="40" cy="40" r="30" fill="none" stroke="currentColor" stroke-width="2"/><line x1="40" y1="40" x2="70" y2="40" stroke="currentColor" stroke-width="2"/><text x="55" y="35" font-size="10" fill="currentColor">r</text>' },
  { shape: 'Rectangle', formulas: ['A = lw'], svg: '<rect x="10" y="20" width="60" height="40" fill="none" stroke="currentColor" stroke-width="2"/><text x="35" y="45" font-size="10" fill="currentColor">l</text><text x="5" y="42" font-size="10" fill="currentColor">w</text>' },
  { shape: 'Triangle', formulas: ['A = ½bh'], svg: '<polygon points="40,10 10,70 70,70" fill="none" stroke="currentColor" stroke-width="2"/><line x1="40" y1="10" x2="40" y2="70" stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/><text x="42" y="45" font-size="10" fill="currentColor">h</text><text x="35" y="75" font-size="10" fill="currentColor">b</text>' },
  { shape: 'Right Triangle (30-60-90)', formulas: ['x, x√3, 2x'], svg: '<polygon points="10,70 10,10 70,70" fill="none" stroke="currentColor" stroke-width="2"/><text x="5" y="42" font-size="10" fill="currentColor">x</text><text x="35" y="75" font-size="10" fill="currentColor">x√3</text><text x="35" y="35" font-size="10" fill="currentColor">2x</text>' },
  { shape: 'Right Triangle (45-45-90)', formulas: ['s, s, s√2'], svg: '<polygon points="10,70 10,10 70,70" fill="none" stroke="currentColor" stroke-width="2"/><text x="5" y="42" font-size="10" fill="currentColor">s</text><text x="35" y="75" font-size="10" fill="currentColor">s</text><text x="35" y="35" font-size="10" fill="currentColor">s√2</text>' },
  { shape: 'Cube', formulas: ['V = s³'], svg: '<rect x="10" y="30" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2"/><rect x="20" y="20" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2"/><line x1="10" y1="30" x2="20" y2="20" stroke="currentColor" stroke-width="2"/><line x1="50" y1="30" x2="60" y2="20" stroke="currentColor" stroke-width="2"/><line x1="10" y1="70" x2="20" y2="60" stroke="currentColor" stroke-width="2"/>' },
  { shape: 'Cylinder', formulas: ['V = πr²h'], svg: '<ellipse cx="40" cy="20" rx="30" ry="8" fill="none" stroke="currentColor" stroke-width="2"/><line x1="10" y1="20" x2="10" y2="60" stroke="currentColor" stroke-width="2"/><line x1="70" y1="20" x2="70" y2="60" stroke="currentColor" stroke-width="2"/><ellipse cx="40" cy="60" rx="30" ry="8" fill="none" stroke="currentColor" stroke-width="2"/>' },
  { shape: 'Sphere', formulas: ['V = (4/3)πr³'], svg: '<circle cx="40" cy="40" r="30" fill="none" stroke="currentColor" stroke-width="2"/><ellipse cx="40" cy="40" rx="30" ry="10" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/>' },
  { shape: 'Cone', formulas: ['V = (1/3)πr²h'], svg: '<ellipse cx="40" cy="60" rx="30" ry="8" fill="none" stroke="currentColor" stroke-width="2"/><line x1="10" y1="60" x2="40" y2="10" stroke="currentColor" stroke-width="2"/><line x1="70" y1="60" x2="40" y2="10" stroke="currentColor" stroke-width="2"/>' },
  { shape: 'Pyramid', formulas: ['V = (1/3)lwh'], svg: '<polygon points="40,10 10,60 70,60" fill="none" stroke="currentColor" stroke-width="2"/><line x1="40" y1="10" x2="40" y2="60" stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/><line x1="10" y1="60" x2="70" y2="50" stroke="currentColor" stroke-width="2"/><line x1="70" y1="60" x2="70" y2="50" stroke="currentColor" stroke-width="2"/>' }
];

function ReferenceDrawer({ open, onClose }) {
  return (
    <Drawer
      title={
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <i className="fas fa-shapes text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Reference</span>
        </div>
      }
      placement="right"
      width={520}
      onClose={onClose}
      open={open}
      styles={{ body: { padding: '24px' } }}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {REFERENCE_SHAPES.map((item, index) => (
            <div key={index} className="flex flex-col items-center p-3 bg-gray-50 rounded-xl">
              <svg width="70" height="70" viewBox="0 0 80 80" className="text-gray-700 mb-2" dangerouslySetInnerHTML={{ __html: item.svg }} />
              <div className="text-center">
                <div className="font-semibold text-gray-900 text-xs mb-1">{item.shape}</div>
                {item.formulas.map((formula, i) => (
                  <div key={i} className="text-[10px] text-gray-600 font-mono">{formula}</div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="text-sm text-gray-700 space-y-2">
            <p><strong>The number of degrees of arc in a circle is 360.</strong></p>
            <p><strong>The number of radians of arc in a circle is 2π.</strong></p>
            <p><strong>The sum of the measures in degrees of the angles of a triangle is 180.</strong></p>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

export default ReferenceDrawer;
