import React, { useState, useRef } from 'react';
import { FileUp, FileText, CheckCircle, Edit3, Eye, Download, Search } from 'lucide-react';
import { Card, CardHeader, CardBody } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Input } from './ui/Input';

interface Document {
  id: string;
  name: string;
  status: 'Draft' | 'In Review' | 'Signed';
  date: string;
  size: string;
}

export const DocumentChamber: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', name: 'Series A Term Sheet.pdf', status: 'In Review', date: '2024-03-24', size: '1.2 MB' },
    { id: '2', name: 'Non-Disclosure Agreement.pdf', status: 'Signed', date: '2024-03-20', size: '245 KB' },
    { id: '3', name: 'Founders Agreement Draft.docx', status: 'Draft', date: '2024-03-22', size: '3.4 MB' },
  ]);

  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newDoc: Document = {
        id: Math.random().toString(),
        name: file.name,
        status: 'Draft',
        date: new Date().toISOString().split('T')[0],
        size: `${(file.size / 1024).toFixed(1)} KB`
      };
      setDocuments([newDoc, ...documents]);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let clientX, clientY;
    if ('touches' in e) {
      e.preventDefault(); // prevent scrolling while signing on mobile
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const saveSignature = () => {
    if (selectedDoc) {
      setDocuments(docs => docs.map(d => 
        d.id === selectedDoc.id ? { ...d, status: 'Signed' } : d
      ));
      setSelectedDoc({ ...selectedDoc, status: 'Signed' });
    }
    setIsSigning(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Signed': return <Badge variant="success" className="w-24 justify-center">Signed</Badge>;
      case 'In Review': return <Badge variant="warning" className="w-24 justify-center">In Review</Badge>;
      case 'Draft': return <Badge variant="gray" className="w-24 justify-center">Draft</Badge>;
      default: return <Badge variant="primary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Chamber</h1>
          <p className="text-gray-600">Securely upload, review, and e-sign your legal documents.</p>
        </div>
        
        <div className="relative overflow-hidden inline-block">
          <Button leftIcon={<FileUp size={18} />}>
            Upload Document
          </Button>
          <input 
            type="file" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document List */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="h-[calc(100vh-16rem)] min-h-[500px] flex flex-col">
            <CardHeader className="border-b border-gray-100 flex-shrink-0">
              <Input 
                placeholder="Search documents..." 
                startAdornment={<Search size={16} />} 
                fullWidth
              />
            </CardHeader>
            <CardBody className="overflow-y-auto flex-1 p-0">
              <div className="divide-y divide-gray-100">
                {documents.map(doc => (
                  <div 
                    key={doc.id} 
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedDoc?.id === doc.id ? 'bg-primary-50 border-l-4 border-primary-500' : 'border-l-4 border-transparent'}`}
                    onClick={() => { setSelectedDoc(doc); setIsSigning(false); }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-start gap-3 overflow-hidden">
                        <FileText size={20} className="text-primary-600 shrink-0 mt-0.5" />
                        <h3 className="font-medium text-gray-900 truncate pr-2 text-sm">{doc.name}</h3>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-3 pl-8">
                      {getStatusBadge(doc.status)}
                      <span className="text-xs text-gray-500">{doc.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Document Preview & Signing Area */}
        <div className="lg:col-span-2">
          {selectedDoc ? (
            <Card className="h-full min-h-[500px]">
              <CardHeader className="flex flex-wrap justify-between items-center gap-2 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-medium text-gray-900 font-mono text-sm max-w-[200px] sm:max-w-xs md:max-w-sm truncate">{selectedDoc.name}</h2>
                  {getStatusBadge(selectedDoc.status)}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" leftIcon={<Eye size={16} />}>Preview</Button>
                  <Button variant="outline" size="sm" leftIcon={<Download size={16} />}>Download</Button>
                </div>
              </CardHeader>
              
              <CardBody className="p-6 bg-gray-100/50 flex flex-col items-center justify-center min-h-[400px]">
                {!isSigning ? (
                  <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 w-full max-w-2xl h-[400px] overflow-hidden relative">
                    {/* Mock Document Content */}
                    <div className="space-y-4 opacity-70">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <br/>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                    
                    {selectedDoc.status === 'Signed' ? (
                      <div className="absolute bottom-10 right-10 flex flex-col items-center rotate-[-5deg]">
                        <span className="font-['Brush_Script_MT',cursive] tracking-widest text-3xl text-blue-800 border-b border-blue-200 inline-block px-4">Signed Document</span>
                        <div className="flex items-center gap-1 text-green-600 mt-2 text-xs font-semibold">
                          <CheckCircle size={14} /> Confirmed
                        </div>
                      </div>
                    ) : (
                      <div className="absolute bottom-10 right-10">
                        <Button onClick={() => setIsSigning(true)} leftIcon={<Edit3 size={16} />}>
                          Click to Sign
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-lg shadow-md border border-primary-100 w-full max-w-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Edit3 size={18} className="text-primary-600" />
                      E-Signature Pad
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">Please sign within the box below using your mouse or touch screen.</p>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 relative overflow-hidden touch-none">
                      <canvas
                        ref={canvasRef}
                        width={450}
                        height={200}
                        className="w-full h-full cursor-crosshair"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center mt-6">
                      <Button variant="ghost" onClick={clearSignature} className="text-gray-500 hover:text-gray-700">
                        Clear
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsSigning(false)}>Cancel</Button>
                        <Button variant="primary" onClick={saveSignature}>Complete Signing</Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          ) : (
            <Card className="h-full min-h-[500px] flex items-center justify-center bg-gray-50 border-dashed border-2">
              <div className="text-center">
                <FileUp size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Select a document to review or sign</p>
              </div>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
};
