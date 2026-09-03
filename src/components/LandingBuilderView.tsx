import React, { useState, useEffect, useRef } from 'react';
import {
  Wand2,
  Image as ImageIcon,
  Upload,
  Copy,
  Check,
  Download,
  ExternalLink,
  RefreshCw,
  Smartphone,
  Monitor,
  Tablet,
  Eye,
  Code2,
  Sparkles,
  SlidersHorizontal,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Layers,
  Palette,
  Phone,
  FileCode,
  Save,
  History,
  X,
  Plus,
  Send,
  Loader2,
  Maximize2,
  Minimize2,
  SplitSquareVertical,
  HelpCircle,
  Bot,
  Zap,
  BrainCircuit,
  CheckCheck,
  Clock,
  UserCheck,
  Flame,
  ShieldCheck,
  Award,
  ChevronRight,
  ArrowRight,
  MessageSquareQuote,
  Scissors
} from 'lucide-react';

interface SavedLandingPage {
  id: string;
  title: string;
  htmlCode: string;
  screenshot?: string | null;
  tags?: string[];
  brandName?: string;
  targetService?: string;
  createdAt: string;
  updatedAt: string;
}

// Sample dental template screenshots (Base64 SVG data URLs for instant one-click testing)
const SAMPLE_TEMPLATES = [
  {
    id: 'sample_implant',
    name: 'Landing Page Cấy Ghép Implant Thụy Sĩ',
    service: 'Trồng Răng Implant Toàn Hàm All-on-4 / All-on-6',
    brand: 'Nha Khoa Tâm Đức Smile',
    prompt: 'Tông màu xanh dương Tâm Đức Smile, thêm bảng so sánh trụ Thụy Sĩ và Hàn Quốc, tặng máy tăm nước.',
    imageSvg: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNjAwIDQwMCI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiMwMjg0YzciLz48cmVjdCB4PSI0MCIgeT0iNDAiIHdpZHRoPSI1MjAiIGhlaWdodD0iNzAiIHJ4PSI4IiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjE1Ii8+PHRleHQgeD0iNjAiIHk9IjgyIiBmaWxsPSIjZmZmZmZmIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMCIgZm9udC13ZWlnaHQ9ImJvbGQiPlTDgk0gxJDhu6hDIFNNSUxFIC0gQ+G6pFkgR0jDiVAgSU1QTEFOVCBLSMOUTkcgxJBBVTwvdGV4dD48cmVjdCB4PSI0MCIgeT0iMTMwIiB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE1MCIgcng9IjgiIGZpbGw9IiNmZmZmZmYiLz48dGV4dCB4PSI2MCIgeT0iMTcwIiBmaWxsPSIjMGYxNzJhIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiPsavdSDEkMOjaSAzNSUgVHLhu6UgSW1wbGFudDwvdGV4dD48dGV4dCB4PSI2MCIgeT0iMjAwIiBmaWxsPSIjNDc1NTY5IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMyI+QuG6o28gaMOgbmggY2jDrW5oIGjDo25nIDE1IG7Eg20gLSBUcuG6oyBnw7NwIDAlPC90ZXh0PjxyZWN0IHg9IjYwIiB5PSIyMjAiIHdpZHRoPSIxNjAiIGhlaWdodD0iMzYiIHJ4PSI2IiBmaWxsPSIjZjU5ZTBiIi8+PHRleHQgeD0iMTQwIiB5PSIyNDMiIGZpbGw9IiNmZmZmZmYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEzIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+xJDhurZUIEzhu4pDSCBOR0FZPC90ZXh0PjxyZWN0IHg9IjM2MCIgeT0iMTMwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgcng9IjgiIGZpbGw9IiMwMzY5YTEiLz48dGV4dCB4PSI0NjAiIHk9IjIxMCIgZmlsbD0iI2ZmZmZmZiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkjDrG5oIOG6om5oIELDoWMgU8SpICZhbXA7IFBow7JuZyBLaMOhbTwvdGV4dD48cmVjdCB4PSI0MCIgeT0iMzAwIiB3aWR0aD0iNTIwIiBoZWlnaHQ9IjYwIiByeD0iOCIgZmlsbD0iIzBjNGE2ZSIvPjx0ZXh0IHg9IjMwMCIgeT0iMzM1IiBmaWxsPSIjN2RkM2ZjIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q2FtIGvhur90IGFuIHRvw6BuIGNodeG6qW4gQuG7mSBZIFThur8gLSBIxqFuIDIwLjAwMCBjYSB0aMOgbmggY8O0bmc8L3RleHQ+PC9zdmc+'
  },
  {
    id: 'sample_veneer',
    name: 'Landing Page Răng Sứ Thẩm Mỹ Cao Cấp',
    service: 'Bọc Răng Sứ & Dán Sứ Veneer Không Mài Nhỏ',
    brand: 'Nha Khoa Thẩm Mỹ Tâm Đức Smile',
    prompt: 'Phong cách sang trọng luxury, tông màu trắng và vàng kim, tôn vinh nụ cười tự nhiên, có form nhận ưu đãi 40%.',
    imageSvg: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNjAwIDQwMCI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiMwZjE3MmEiLz48cmVjdCB4PSI0MCIgeT0iNDAiIHdpZHRoPSI1MjAiIGhlaWdodD0iNjAiIHJ4PSI4IiBmaWxsPSIjMWUyOTNiIi8+PHRleHQgeD0iNjAiIHk9Ijc4IiBmaWxsPSIjZjU5ZTBiIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiPktJ4bq+TiBU4bqgTyBO4bukIEPGr+G7nEkgS0lNIEPGr8agTkcgLSBEw4FOIFPhu6ggVkVORUVSPC90ZXh0PjxyZWN0IHg9IjQwIiB5PSIxMjAiIHdpZHRoPSI1MjAiIGhlaWdodD0iMTcwIiByeD0iOCIgZmlsbD0iIzFlMjkzYiIvPjx0ZXh0IHg9IjYwIiB5PSIxNjAiIGZpbGw9IiNmZmZmZmYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjIyIiBmb250LXdlaWdodD0iYm9sZCI+UsSDbmcgU+G7qSBaaXJjb25pYSAmYW1wOyBDZXJjb24gSFQ8L3RleHQ+PHRleHQgeD0iNjAiIHk9IjE5NSIgZmlsbD0iIzk0YTNiOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPkLhuqNvIHThu5NuIDk5JSByxINuZyBn4buRYyAtIFRy4bqvbmcgdHJvbmcgdOG7sSBuaGnDqm4gLSDEkOG7mSBi4buBbiAyMCBuxINtPC90ZXh0PjxyZWN0IHg9IjYwIiB5PSIyMjUiIHdpZHRoPSIyMDAiIGhlaWdodD0iNDAiIHJ4PSIyMCIgZmlsbD0iI2Y1OWUwYiIvPjx0ZXh0IHg9IjE2MCIgeT0iMjUwIiBmaWxsPSIjMDAwMDAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5I4bqsTiBC4bqiTkcgR0nDgSDGr1UgxJDDg0k8L3RleHQ+PHJlY3QgeD0iNDAiIHk9IjMxMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSI1MCIgcng9IjgiIGZpbGw9IiMzMzQxNTUiLz48dGV4dCB4PSIxMjAiIHk9IjM0MCIgZmlsbD0iI2ZmZmZmZiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlRoaeG6v3Qga+G6vyBu4bulIGPGsOG7nWkgRFNEPC90ZXh0PjxyZWN0IHg9IjIyMCIgeT0iMzEwIiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjUwIiByeD0iOCIgZmlsbD0iIzMzNDE1NSIvPjx0ZXh0IHg9IjMwMCIgeT0iMzQwIiBmaWxsPSIjZmZmZmZmIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QuG6o28gaMOgbmggdHLhu41uIMSR4budaTwvdGV4dD48cmVjdCB4PSI0MDAiIHk9IjMxMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSI1MCIgcng9IjgiIGZpbGw9IiMzMzQxNTUiLz48dGV4dCB4PSI0ODAiIHk9IjM0MCIgZmlsbD0iI2ZmZmZmZiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlRy4bqjIGfDs3AgMCUgcXVhIHRo4bq7PC90ZXh0Pjwvc3ZnPg=='
  },
  {
    id: 'sample_invisalign',
    name: 'Landing Page Niềng Răng Trong Suốt',
    service: 'Niềng Răng Trong Suốt AI & Mắc Cài Thông Minh',
    brand: 'Tâm Đức Smile Orthodontics',
    prompt: 'Tông màu xanh ngọc y tế hiện đại, trẻ trung, có video mô phỏng nụ cười 3D Clincheck, form đăng ký quét dấu răng miễn phí.',
    imageSvg: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNjAwIDQwMCI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiMwNjRlM2IiLz48cmVjdCB4PSI0MCIgeT0iNDAiIHdpZHRoPSI1MjAiIGhlaWdodD0iNjAiIHJ4PSI4IiBmaWxsPSIjMDY1ZjQ2Ii8+PHRleHQgeD0iNjAiIHk9Ijc4IiBmaWxsPSIjYTdmM2QwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiPk5J4buATkcgUsSCTkcgVFJPTkcgU1Xhu5BUIC0gVEjhuqRZIFRSxq/hu5pDIE7hu6QgQ8av4bucSTwvdGV4dD48cmVjdCB4PSI0MCIgeT0iMTIwIiB3aWR0aD0iNTIwIiBoZWlnaHQ9IjE3MCIgcng9IjgiIGZpbGw9IiMwNDc4NTciLz48dGV4dCB4PSI2MCIgeT0iMTY1IiBmaWxsPSIjZmZmZmZmIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMiIgZm9udC13ZWlnaHQ9ImJvbGQiPkPDtG5nIE5naOG7hyBTY2FuIDNEIGlUZXJvIEVsZW1lbnQgNUQ8L3RleHQ+PHRleHQgeD0iNjAiIHk9IjIwMCIgZmlsbD0iI2QxZmFlNSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPktoYXkgbmnhu4FuZyB2w7QgaMOsbmggLSBUaMOhbyBs4bqvcCBk4buFIGTDoG5nIC0gUsO6dCBuZ+G6r24gMzAlIHRo4budaSBnaWFuPC90ZXh0PjxyZWN0IHg9IjYwIiB5PSIyMjUiIHdpZHRoPSIyMjAiIGhlaWdodD0iNDAiIHJ4PSI4IiBmaWxsPSIjMTBiOTgxIi8+PHRleHQgeD0iMTcwIiB5PSIyNTAiIGZpbGw9IiNmZmZmZmYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEzIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U0NBTiBSxIJORyBNSeG7hE4gUEjDjSBIw5RNIE5BWTwvdGV4dD48cmVjdCB4PSI0MCIgeT0iMzEwIiB3aWR0aD0iNTIwIiBoZWlnaHQ9IjUwIiByeD0iOCIgZmlsbD0iIzA2NWY0NiIvPjx0ZXh0IHg9IjMwMCIgeT0iMzQwIiBmaWxsPSIjNmVlN2I3IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VOG6t25nIGfDs2kgdOG6qXkgdHLhuq9uZyByxINuZyAzLjUgdHJp4buHdSBraGkgdGhhbmggdG/DoW4gMSBs4bqnbjwvdGV4dD48L3N2Zz4='
  }
];

export default function LandingBuilderView() {
  // Input image state
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Form options
  const [brandName, setBrandName] = useState<string>('Nha Khoa Tâm Đức Smile');
  const [targetService, setTargetService] = useState<string>('Trồng Răng Implant & Răng Sứ Thẩm Mỹ');
  const [hotline, setHotline] = useState<string>('1900 8098');
  const [colorTheme, setColorTheme] = useState<string>('tam_duc_blue');
  const [includeBookingForm, setIncludeBookingForm] = useState<boolean>(true);
  const [includeFloatingCallButtons, setIncludeFloatingCallButtons] = useState<boolean>(true);
  const [scopeMode, setScopeMode] = useState<'full_page' | 'section_only'>('full_page');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false);

  // Multi-AI Engine & Copywriting Tone
  const [selectedEngine, setSelectedEngine] = useState<'multi_agent' | 'gemini_flash' | 'gemini_pro' | 'claude_code' | 'cro_sales'>('multi_agent');
  const [copywritingStyle, setCopywritingStyle] = useState<'cro_high_convert' | 'medical_authority' | 'luxury_premium' | 'balanced'>('cro_high_convert');
  const [modelUsedInfo, setModelUsedInfo] = useState<string>('');
  const [pipelineStepsInfo, setPipelineStepsInfo] = useState<string[]>([]);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [activeEnhancement, setActiveEnhancement] = useState<string | null>(null);
  const [enhancementToast, setEnhancementToast] = useState<string | null>(null);
  const [showPipelineDetails, setShowPipelineDetails] = useState<boolean>(false);

  // Generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Result state
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [extractedSectionCode, setExtractedSectionCode] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState<string>('Landing Page Nha Khoa');
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'compare'>('preview');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSectionCopied, setIsSectionCopied] = useState<boolean>(false);
  const [viewCodeType, setViewCodeType] = useState<'full' | 'section'>('full');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Refine state
  const [refinePrompt, setRefinePrompt] = useState<string>('');
  const [isRefining, setIsRefining] = useState<boolean>(false);

  // Saved landing pages
  const [savedPages, setSavedPages] = useState<SavedLandingPage[]>([]);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load saved landing pages on mount
  useEffect(() => {
    fetchSavedPages();
  }, []);

  // Window paste listener (Ctrl + V from anywhere in the window)
  useEffect(() => {
    const handleWindowPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleImageFile(file, `Ảnh_Dan_${new Date().toLocaleTimeString('vi-VN')}.png`);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handleWindowPaste);
    return () => window.removeEventListener('paste', handleWindowPaste);
  }, []);

  const fetchSavedPages = async () => {
    try {
      const res = await fetch('/api/landing/pages');
      if (res.ok) {
        const data = await res.json();
        if (data.pages && Array.isArray(data.pages)) {
          setSavedPages(data.pages);
        }
      }
    } catch (err) {
      console.warn('Error fetching saved landing pages:', err);
    }
  };

  const handleImageFile = (file: File, fallbackName?: string) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn đúng định dạng hình ảnh (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSelectedImageBase64(base64);
      setImageFileName(file.name || fallbackName || 'image.png');
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_TEMPLATES[0]) => {
    setImageFileName(sample.name);
    setTargetService(sample.service);
    setBrandName(sample.brand);
    setCustomPrompt(sample.prompt);
    setErrorMsg(null);

    // Rasterize SVG onto a canvas so Gemini Vision receives high-compatibility PNG base64
    try {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 600;
          canvas.height = 400;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 600, 400);
            ctx.drawImage(img, 0, 0, 600, 400);
            setSelectedImageBase64(canvas.toDataURL('image/png'));
            return;
          }
        } catch (_) {}
        setSelectedImageBase64(sample.imageSvg);
      };
      img.onerror = () => {
        setSelectedImageBase64(sample.imageSvg);
      };
      img.src = sample.imageSvg;
    } catch (_) {
      setSelectedImageBase64(sample.imageSvg);
    }
  };

  // Main generator trigger
  const handleGenerateLandingPage = async () => {
    if (!selectedImageBase64 && !customPrompt.trim()) {
      setErrorMsg('Vui lòng tải lên ảnh chụp màn hình web mẫu hoặc nhập yêu cầu thiết kế.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);

    let stepMsg1 = 'Đang gửi ảnh sang AI Gemini Vision để phân tích cấu trúc...';
    let stepMsg2 = 'Đang bóc tách layout, font chữ, màu sắc và khối dịch vụ...';
    let stepMsg3 = 'Đang lập trình mã nguồn HTML5, Tailwind CSS và gắn ảnh Unsplash...';

    if (selectedEngine === 'multi_agent') {
      stepMsg1 = '🚀 [Tác tử 1 - Gemini Vision]: Đang bóc tách bố cục, màu sắc & vị trí các khối ảnh mẫu...';
      stepMsg2 = '✍️ [Tác tử 2 - AI Copywriter]: Đang viết lại nội dung bán hàng CRO, xử lý nỗi sợ đau & ưu đãi...';
      stepMsg3 = '💻 [Tác tử 3 - Code Architect]: Đang lập trình HTML5 + Tailwind CSS hoàn thiện & responsive...';
    } else if (selectedEngine === 'claude_code') {
      stepMsg1 = '🎨 [Claude Sonnet Style]: Đang phân tích typography, grid spacing và visual hierarchy...';
      stepMsg2 = '💎 [Claude Sonnet Style]: Đang sinh mã Tailwind CSS tinh xảo, tối ưu hiển thị Mobile & Tablet...';
      stepMsg3 = '⚡ Đang tích hợp hiệu ứng vi tương tác và modal đặt lịch khám...';
    } else if (selectedEngine === 'cro_sales') {
      stepMsg1 = '🎯 [GPT-4o CRO Specialist]: Đang nghiên cứu tâm lý bệnh nhân và thiết kế tiêu đề Hook...';
      stepMsg2 = '🎁 [GPT-4o CRO Specialist]: Đang xây dựng khối cam kết bảo hành, bảng giá và CTA chuyển đổi...';
      stepMsg3 = '🔥 Đang xuất bản mã nguồn landing page hoàn thiện...';
    }

    setGenerationStep(stepMsg1);

    try {
      const timer1 = setTimeout(() => {
        setGenerationStep(stepMsg2);
      }, 1800);

      const timer2 = setTimeout(() => {
        setGenerationStep(stepMsg3);
      }, 4200);

      const timer3 = setTimeout(() => {
        setGenerationStep('Đang hoàn thiện JavaScript tương tác (Modal đặt hẹn, Form tư vấn, Hotline nổi)...');
      }, 7000);

      const res = await fetch('/api/landing/generate-from-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: selectedImageBase64,
          customPrompt: customPrompt.trim(),
          brandName: brandName.trim(),
          targetService: targetService.trim(),
          primaryColorTheme: colorTheme,
          hotline: hotline.trim(),
          includeBookingForm,
          includeFloatingCallButtons,
          scopeMode,
          engine: selectedEngine,
          copywritingStyle,
        }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const detailedMessage = errorData.details
          ? `${errorData.error} (${errorData.details})`
          : (errorData.error || `Lỗi máy chủ (${res.status})`);
        throw new Error(detailedMessage);
      }

      const data = await res.json();
      if (!data.htmlCode) {
        throw new Error('Không nhận được mã HTML từ AI');
      }

      setGeneratedHtml(data.htmlCode);
      setExtractedSectionCode(data.sectionCode || null);
      setPageTitle(data.title || `${brandName} - ${targetService}`);
      setModelUsedInfo(data.modelUsed || 'Gemini AI');
      setPipelineStepsInfo(data.pipelineSteps || []);
      setActiveTab('preview');
      setGenerationStep('');

      // Auto-save generated landing page
      handleSavePage(data.htmlCode, data.title, selectedImageBase64);
    } catch (err: any) {
      console.error('Lỗi khi sinh mã Landing Page:', err);
      setErrorMsg(err.message || 'Không thể tạo mã giao diện lúc này. Vui lòng thử lại.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // One-click quick AI enhancement handler
  const handleEnhanceComponent = async (enhancementType: string, label: string) => {
    if (!generatedHtml) return;
    setIsEnhancing(true);
    setActiveEnhancement(enhancementType);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/landing/enhance-component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          htmlCode: generatedHtml,
          enhancementType,
          brandName,
          targetService,
          hotline,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Lỗi khi nâng cấp khối giao diện');
      }

      const data = await res.json();
      if (data.htmlCode) {
        setGeneratedHtml(data.htmlCode);
        setEnhancementToast(`Đã áp dụng thành công: ${label}!`);
        setTimeout(() => setEnhancementToast(null), 3500);
        setActiveTab('preview');
      }
    } catch (err: any) {
      console.error('Lỗi khi nâng cấp:', err);
      setErrorMsg(err.message || 'Không thể nâng cấp khối giao diện lúc này');
    } finally {
      setIsEnhancing(false);
      setActiveEnhancement(null);
    }
  };

  // Refine existing code trigger
  const handleRefineCode = async () => {
    if (!refinePrompt.trim() || !generatedHtml) return;

    setIsRefining(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/landing/generate-from-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          existingCode: generatedHtml,
          refinementInstruction: refinePrompt.trim(),
          brandName,
          targetService,
          hotline,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Lỗi khi tinh chỉnh code');
      }

      const data = await res.json();
      if (data.htmlCode) {
        setGeneratedHtml(data.htmlCode);
        setRefinePrompt('');
        setActiveTab('preview');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể tinh chỉnh mã');
    } finally {
      setIsRefining(false);
    }
  };

  // Copy Code to Clipboard
  const handleCopyCode = () => {
    if (!generatedHtml) return;
    navigator.clipboard.writeText(generatedHtml).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  // Copy only Section Code to Clipboard
  const handleCopySectionCode = () => {
    let codeToCopy = extractedSectionCode;
    if (!codeToCopy && generatedHtml) {
      const match = generatedHtml.match(/<!--\s*BEGIN_SECTION_CODE\s*-->([\s\S]*?)<!--\s*END_SECTION_CODE\s*-->/i) || generatedHtml.match(/<section[\s\S]*?<\/section>/i);
      if (match) codeToCopy = (match[1] || match[0]).trim();
      else codeToCopy = generatedHtml;
    }
    if (!codeToCopy) return;
    navigator.clipboard.writeText(codeToCopy).then(() => {
      setIsSectionCopied(true);
      setTimeout(() => setIsSectionCopied(false), 2500);
    });
  };

  // Download complete HTML file
  const handleDownloadHtml = () => {
    if (!generatedHtml) return;
    const blob = new Blob([generatedHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = `${pageTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_landing_page.html`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Open Preview in New Tab
  const handleOpenInNewTab = () => {
    if (!generatedHtml) return;
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.open();
      newWindow.document.write(generatedHtml);
      newWindow.document.close();
    }
  };

  // Save Landing Page to Server
  const handleSavePage = async (htmlToSave = generatedHtml, titleToSave = pageTitle, screenshotToSave = selectedImageBase64) => {
    if (!htmlToSave) return;

    try {
      const res = await fetch('/api/landing/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titleToSave,
          htmlCode: htmlToSave,
          screenshot: screenshotToSave,
          brandName,
          targetService,
          tags: ['Nha Khoa', targetService.split(' ')[0]],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSaveSuccessMsg('Đã lưu landing page vào thư viện thành công!');
        setTimeout(() => setSaveSuccessMsg(null), 3000);
        fetchSavedPages();
      }
    } catch (err) {
      console.warn('Error saving page:', err);
    }
  };

  // Delete saved page
  const handleDeleteSavedPage = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Bạn có chắc muốn xóa trang này khỏi thư viện?')) return;

    try {
      const res = await fetch(`/api/landing/pages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSavedPages((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.warn('Error deleting page:', err);
    }
  };

  // Load a saved page into current workspace
  const handleLoadSavedPage = (page: SavedLandingPage) => {
    setGeneratedHtml(page.htmlCode);
    setPageTitle(page.title);
    if (page.screenshot) {
      setSelectedImageBase64(page.screenshot);
      setImageFileName(page.title);
    }
    if (page.brandName) setBrandName(page.brandName);
    if (page.targetService) setTargetService(page.targetService);
    setIsSavedDrawerOpen(false);
    setActiveTab('preview');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-5 sm:p-6 rounded-2xl border border-slate-700/80 shadow-xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Gemini Vision 3.8 Multimodal • Tự Động Sinh Mã HTML5 + Tailwind CSS</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Wand2 className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
              <span>Tạo Landing Page AI Từ Ảnh Chụp Màn Hình</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Chụp ảnh màn hình bất kỳ website đối thủ hoặc mẫu landing page nào, dán thẳng vào đây (<kbd className="px-1.5 py-0.5 text-[11px] bg-slate-800 text-cyan-300 rounded border border-slate-600 font-mono">Ctrl + V</kbd>). AI sẽ phân tích bố cục và tự động viết thành mã nguồn HTML5 hoàn chỉnh, tương thích điện thoại và máy tính!
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsSavedDrawerOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs sm:text-sm font-medium transition-all flex items-center gap-2 shadow-sm"
            >
              <History className="w-4 h-4 text-cyan-400" />
              <span>Thư Viện Đã Tạo ({savedPages.length})</span>
            </button>

            {generatedHtml && (
              <button
                onClick={handleDownloadHtml}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/30"
              >
                <Download className="w-4 h-4" />
                <span>Tải File .html</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-950/70 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs sm:text-sm flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-950/70 border border-rose-500/50 rounded-xl text-rose-200 text-xs sm:text-sm flex items-start gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-rose-100">Đã xảy ra lỗi:</p>
            <p className="text-rose-300 mt-0.5">{errorMsg}</p>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-rose-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Studio Grid: Left input zone, Right output workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Image Upload & Configuration (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card: Upload / Paste Screenshot */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-cyan-400" />
                <span>1. Tải Lên Hoặc Dán Ảnh Chụp Web Mẫu</span>
              </h2>
              {selectedImageBase64 && (
                <button
                  onClick={() => {
                    setSelectedImageBase64(null);
                    setImageFileName('');
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa ảnh</span>
                </button>
              )}
            </div>

            {/* Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer border-2 border-dashed rounded-xl p-4 sm:p-6 transition-all duration-200 text-center flex flex-col items-center justify-center min-h-[190px] ${
                isDragging
                  ? 'border-cyan-400 bg-cyan-950/30 ring-2 ring-cyan-400/20'
                  : selectedImageBase64
                  ? 'border-emerald-500/60 bg-emerald-950/20'
                  : 'border-slate-700 hover:border-cyan-500/60 bg-slate-950/50 hover:bg-slate-950/80'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageFile(e.target.files[0]);
                  }
                }}
              />

              {selectedImageBase64 ? (
                <div className="space-y-2.5 w-full">
                  <div className="max-h-48 overflow-hidden rounded-lg border border-slate-700/80 mx-auto shadow-md">
                    <img
                      src={selectedImageBase64}
                      alt="Ảnh mẫu tải lên"
                      className="w-full h-auto max-h-48 object-contain mx-auto bg-slate-950"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 font-medium">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="truncate max-w-[220px]">{imageFileName || 'Ảnh đã sẵn sàng'}</span>
                    <span className="text-slate-400">• Bấm để đổi ảnh</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-200">
                      Kéo thả ảnh hoặc <span className="text-cyan-400 underline">bấm để tải lên</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Hỗ trợ chụp màn hình và dán thẳng: <kbd className="px-1 py-0.5 bg-slate-800 rounded border border-slate-700 text-cyan-300 font-mono">Ctrl + V</kbd>
                    </p>
                  </div>
                  <div className="inline-block text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                    PNG, JPG, WEBP, ảnh chụp toàn trang
                  </div>
                </div>
              )}
            </div>

            {/* Quick Sample Templates */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Hoặc chọn mẫu nhanh để thử nghiệm ngay:</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => handleSelectSample(tpl)}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group"
                  >
                    <div className="text-[11px] font-bold text-slate-200 group-hover:text-cyan-300 line-clamp-1">
                      {tpl.name.replace('Landing Page ', '')}
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {tpl.service.split(' ')[0]} {tpl.service.split(' ')[1]}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card: Branding & Target Options */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4">
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>2. Cấu Hình Thương Hiệu &amp; Dịch Vụ</span>
            </h2>

            {/* Scope Mode Selector: Full Page vs Section Only */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Phạm Vi Sinh Mã Từ Ảnh:</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-medium border border-cyan-500/30">
                  {scopeMode === 'section_only' ? 'Chỉ Code Đoạn Trong Ảnh' : 'Toàn Trang Hoàn Chỉnh'}
                </span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setScopeMode('full_page')}
                  className={`p-2.5 rounded-xl border text-left transition-all relative ${
                    scopeMode === 'full_page'
                      ? 'bg-cyan-950/50 border-cyan-400 text-white ring-1 ring-cyan-400/40 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-cyan-300">🌐 Cả Landing Page</span>
                    {scopeMode === 'full_page' && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    Tạo cả website đầy đủ: Header, Hero, Khối dịch vụ, Bảng giá, Form &amp; Footer.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setScopeMode('section_only')}
                  className={`p-2.5 rounded-xl border text-left transition-all relative ${
                    scopeMode === 'section_only'
                      ? 'bg-amber-950/50 border-amber-400 text-white ring-1 ring-amber-400/40 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-amber-300 flex items-center gap-1">
                      <Scissors className="w-3 h-3 text-amber-400" />
                      <span>Chỉ Đoạn/Khối Trong Ảnh</span>
                    </span>
                    {scopeMode === 'section_only' && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    Chỉ code ĐÚNG phần trong ảnh (bảng giá, banner, form, bác sĩ...), không sinh header/footer thừa. Dễ nhúng vào web có sẵn!
                  </p>
                </button>
              </div>
            </div>

            <div className="space-y-3.5">
              {/* Brand Name */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Tên Thương Hiệu Phòng Khám</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Ví dụ: Nha Khoa Tâm Đức Smile"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Service & Campaign */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Dịch Vụ Mục Tiêu</label>
                <input
                  type="text"
                  value={targetService}
                  onChange={(e) => setTargetService(e.target.value)}
                  placeholder="Ví dụ: Trồng Răng Implant Toàn Hàm / Bọc Sứ Veneer"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Hotline */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Hotline Liên Hệ Nổi Bật</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-2.5 text-cyan-400 pointer-events-none" />
                  <input
                    type="text"
                    value={hotline}
                    onChange={(e) => setHotline(e.target.value)}
                    placeholder="1900 8098"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              {/* Color Theme */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Bộ Màu Sắc Giao Diện</span>
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setColorTheme('tam_duc_blue')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      colorTheme === 'tam_duc_blue'
                        ? 'bg-sky-950/60 border-cyan-400 text-white ring-1 ring-cyan-400/40'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-sky-500 shrink-0 border border-white/40" />
                    <div>
                      <p className="font-semibold text-slate-200">Xanh Tâm Đức</p>
                      <p className="text-[10px] text-slate-400">Uy tín + Vàng Gold CTA</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setColorTheme('luxury_gold')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      colorTheme === 'luxury_gold'
                        ? 'bg-amber-950/60 border-amber-400 text-white ring-1 ring-amber-400/40'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-amber-500 shrink-0 border border-white/40" />
                    <div>
                      <p className="font-semibold text-slate-200">Luxury Gold</p>
                      <p className="text-[10px] text-slate-400">Đen sang + Ánh kim</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setColorTheme('emerald_health')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      colorTheme === 'emerald_health'
                        ? 'bg-emerald-950/60 border-emerald-400 text-white ring-1 ring-emerald-400/40'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-emerald-500 shrink-0 border border-white/40" />
                    <div>
                      <p className="font-semibold text-slate-200">Xanh Y Tế</p>
                      <p className="text-[10px] text-slate-400">Ngọc lục bảo an tâm</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setColorTheme('original')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      colorTheme === 'original'
                        ? 'bg-purple-950/60 border-purple-400 text-white ring-1 ring-purple-400/40'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 shrink-0 border border-white/40" />
                    <div>
                      <p className="font-semibold text-slate-200">Giữ Nguyên Ảnh</p>
                      <p className="text-[10px] text-slate-400">Sao chép màu ảnh gốc</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Checkbox Options */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeBookingForm}
                    onChange={(e) => setIncludeBookingForm(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
                  />
                  <span>Tự động tạo Form Đăng Ký Khám Nhận Ưu Đãi trực tiếp trên trang</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeFloatingCallButtons}
                    onChange={(e) => setIncludeFloatingCallButtons(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
                  />
                  <span>Thêm Nút Hotline &amp; Zalo rung lắc nổi ở góc màn hình</span>
                </label>
              </div>

              {/* Custom Prompt Textarea */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                  <span>Yêu cầu bổ sung cho AI (Tùy chọn)</span>
                  <span className="text-[10px] text-slate-400">Không bắt buộc</span>
                </label>
                <textarea
                  rows={2}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Ví dụ: Đổi tiêu đề thành Khuyến Mãi Mùa Thu, thêm bảng so sánh 3 trụ Implant, cam kết trả góp 0%..."
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Card 3: AI Engine & Copywriting Tone (Multi-AI Support) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>3. Mô Hình AI &amp; Văn Phong Bán Hàng (Multi-AI)</span>
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-medium">
                Đa Tác Tử
              </span>
            </div>

            {/* AI Engine Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Chọn Cơ Chế / Mô Hình AI Phân Tích:</span>
                <span className="text-[10px] text-amber-400 font-mono">5 Chế Độ Chuyên Biệt</span>
              </label>

              <div className="space-y-2">
                {/* Multi-Agent (Recommended) */}
                <button
                  type="button"
                  onClick={() => setSelectedEngine('multi_agent')}
                  className={`w-full p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                    selectedEngine === 'multi_agent'
                      ? 'bg-gradient-to-r from-amber-950/40 via-cyan-950/30 to-indigo-950/40 border-amber-400/80 ring-1 ring-amber-400/40'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs sm:text-sm font-bold text-white">Hợp Lực Đa Tác Tử (Multi-Agent Pipeline)</p>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-300 font-semibold border border-amber-400/30">
                            ⭐ KHUYÊN DÙNG
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                          Quy trình 3 bước chuyên sâu: <strong>Gemini Vision</strong> bóc tách bố cục ảnh ➔ <strong>AI Copywriter</strong> viết lời chào hàng thôi miên ➔ <strong>Code Architect</strong> hoàn thiện mã nguồn HTML5 + Tailwind CSS.
                        </p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border shrink-0 mt-1 flex items-center justify-center ${
                      selectedEngine === 'multi_agent' ? 'border-amber-400 bg-amber-500' : 'border-slate-600'
                    }`}>
                      {selectedEngine === 'multi_agent' && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                    </div>
                  </div>

                  {/* 3 Step Badge preview */}
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[10px] text-slate-400 overflow-x-auto">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 whitespace-nowrap">1. Gemini Vision</span>
                    <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700 whitespace-nowrap">2. CRO Copywriter</span>
                    <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 border border-slate-700 whitespace-nowrap">3. Code Architect</span>
                  </div>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  {/* Gemini 3.8 Flash */}
                  <button
                    type="button"
                    onClick={() => setSelectedEngine('gemini_flash')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedEngine === 'gemini_flash'
                        ? 'bg-cyan-950/50 border-cyan-400 ring-1 ring-cyan-400/40 text-white'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-cyan-300">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Gemini 3.8 Flash</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                      Siêu tốc (5s), phân tích đa phương thức trực tiếp và xuất mã ngay.
                    </p>
                  </button>

                  {/* Gemini 2.5 Pro */}
                  <button
                    type="button"
                    onClick={() => setSelectedEngine('gemini_pro')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedEngine === 'gemini_pro'
                        ? 'bg-indigo-950/50 border-indigo-400 ring-1 ring-indigo-400/40 text-white'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-300">
                      <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Gemini 2.5 Pro</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                      Tư duy kiến trúc sâu, giải mã bố cục ảnh phức tạp và các trang dài.
                    </p>
                  </button>

                  {/* Claude Code Style */}
                  <button
                    type="button"
                    onClick={() => setSelectedEngine('claude_code')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedEngine === 'claude_code'
                        ? 'bg-orange-950/50 border-orange-400 ring-1 ring-orange-400/40 text-white'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-orange-300">
                      <Code2 className="w-3.5 h-3.5 text-orange-400" />
                      <span>Claude Sonnet Style</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                      Tối ưu Frontend, chuẩn typography, spacing tinh xảo và responsive.
                    </p>
                  </button>

                  {/* GPT-4o CRO */}
                  <button
                    type="button"
                    onClick={() => setSelectedEngine('cro_sales')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedEngine === 'cro_sales'
                        ? 'bg-emerald-950/50 border-emerald-400 ring-1 ring-emerald-400/40 text-white'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-300">
                      <Flame className="w-3.5 h-3.5 text-emerald-400" />
                      <span>GPT-4o CRO Specialist</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                      Đột phá tỷ lệ chuyển đổi, kích thích khách hàng bấm đăng ký ngay.
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {/* Copywriting Style Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MessageSquareQuote className="w-3.5 h-3.5 text-amber-400" />
                <span>Phong Cách Nội Dung Bán Hàng (Copywriting Tone):</span>
              </label>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setCopywritingStyle('cro_high_convert')}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    copywritingStyle === 'cro_high_convert'
                      ? 'bg-amber-950/40 border-amber-400 text-amber-200 font-semibold ring-1 ring-amber-400/30'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <p className="font-bold text-[11px] text-amber-300">🏆 Thôi Miên Chuyển Đổi</p>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">Xử lý nỗi sợ, bảo hành 15 năm, trả góp 0%</p>
                </button>

                <button
                  type="button"
                  onClick={() => setCopywritingStyle('medical_authority')}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    copywritingStyle === 'medical_authority'
                      ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200 font-semibold ring-1 ring-cyan-400/30'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <p className="font-bold text-[11px] text-cyan-300">🩺 Uy Tín Y Khoa</p>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">Bác sĩ CKI, máy CT 3D, vô trùng chuẩn</p>
                </button>

                <button
                  type="button"
                  onClick={() => setCopywritingStyle('luxury_premium')}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    copywritingStyle === 'luxury_premium'
                      ? 'bg-purple-950/40 border-purple-400 text-purple-200 font-semibold ring-1 ring-purple-400/30'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <p className="font-bold text-[11px] text-purple-300">✨ Sang Trọng Thẩm Mỹ</p>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">Nụ cười tỷ lệ vàng, phong cách 5 sao</p>
                </button>

                <button
                  type="button"
                  onClick={() => setCopywritingStyle('balanced')}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    copywritingStyle === 'balanced'
                      ? 'bg-emerald-950/40 border-emerald-400 text-emerald-200 font-semibold ring-1 ring-emerald-400/30'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <p className="font-bold text-[11px] text-emerald-300">⚖️ Chuẩn Mực Cân Bằng</p>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">Hài hòa thông tin dịch vụ &amp; ưu đãi</p>
                </button>
              </div>
            </div>

            {/* Primary Action Button inside Card 3 */}
            <div className="pt-2">
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerateLandingPage}
                className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white transition-all duration-200 flex items-center justify-center gap-2.5 shadow-xl ${
                  isGenerating
                    ? 'bg-slate-700 cursor-not-allowed text-slate-300'
                    : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 shadow-amber-950/40 hover:scale-[1.01]'
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
                    <span>AI Đang Phân Tích &amp; Lập Trình Mã...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 text-amber-200" />
                    <span>Tạo Landing Page Từ Ảnh Này Ngay</span>
                  </>
                )}
              </button>

              {isGenerating && generationStep && (
                <p className="text-center text-xs text-amber-300/90 font-medium mt-2 animate-pulse">
                  {generationStep}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Code & Live Preview Studio (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden flex flex-col min-h-[640px]">
            {/* Studio Workspace Header Bar */}
            <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
              {/* Tabs: Preview / Code / Compare */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'preview'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem Trước (Preview)</span>
                </button>

                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'code'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Mã Nguồn (HTML)</span>
                </button>

                {selectedImageBase64 && (
                  <button
                    onClick={() => setActiveTab('compare')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      activeTab === 'compare'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <SplitSquareVertical className="w-3.5 h-3.5" />
                    <span>So Sánh Ảnh Gốc</span>
                  </button>
                )}
              </div>

              {/* Actions & Device Switcher */}
              <div className="flex items-center gap-2">
                {activeTab === 'preview' && (
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <button
                      onClick={() => setPreviewDevice('desktop')}
                      title="Chế độ Máy tính (Desktop 100%)"
                      className={`p-1.5 rounded-md transition-colors ${
                        previewDevice === 'desktop' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Monitor className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPreviewDevice('tablet')}
                      title="Chế độ Máy tính bảng (Tablet 768px)"
                      className={`p-1.5 rounded-md transition-colors ${
                        previewDevice === 'tablet' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Tablet className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPreviewDevice('mobile')}
                      title="Chế độ Điện thoại (Mobile 390px)"
                      className={`p-1.5 rounded-md transition-colors ${
                        previewDevice === 'mobile' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {generatedHtml && (
                  <>
                    <button
                      onClick={handleCopySectionCode}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 hover:text-amber-200 text-xs font-semibold border border-amber-500/40 transition-colors flex items-center gap-1.5 shadow-sm"
                      title="Chỉ sao chép đoạn mã khối <section>...</section> để nhúng vào website hoặc Ladipage"
                    >
                      {isSectionCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Đã chép Khối!</span>
                        </>
                      ) : (
                        <>
                          <Scissors className="w-3.5 h-3.5 text-amber-400" />
                          <span>Chép Khối Section</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleCopyCode}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
                      title="Sao chép toàn bộ mã HTML"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Đã chép toàn trang!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Sao chép toàn trang</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleOpenInNewTab}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                      title="Mở toàn màn hình trong tab mới"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* AI Engine Model Info & Multi-Agent Steps Bar */}
            {generatedHtml && (
              <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 shadow-sm">
                    <Bot className="w-3.5 h-3.5 text-cyan-400" />
                    <span>AI Engine: {modelUsedInfo || 'Đa Tác Tử (Gemini Vision + Copywriter + Code Architect)'}</span>
                  </span>

                  {pipelineStepsInfo.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowPipelineDetails(!showPipelineDetails)}
                      className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-amber-950/40 transition-colors"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{showPipelineDetails ? 'Ẩn chi tiết 3 tác tử ▲' : 'Xem chi tiết 3 tác tử ▼'}</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Sẵn sàng xuất bản</span>
                </div>
              </div>
            )}

            {/* Expanded Multi-Agent Pipeline Steps */}
            {generatedHtml && showPipelineDetails && pipelineStepsInfo.length > 0 && (
              <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 space-y-2 animate-fadeIn">
                <p className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4 text-amber-400" />
                  <span>Quy Trình 3 Tác Tử Đã Phối Hợp Thực Thi:</span>
                </p>
                <div className="space-y-1.5 pl-3 border-l-2 border-amber-500/40">
                  {pipelineStepsInfo.map((step, idx) => (
                    <div key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick AI Enhancement Booster Bar */}
            {generatedHtml && (
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 px-4 py-2.5 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span className="text-xs font-bold text-slate-200">Nâng Cấp Nhanh Bằng AI:</span>
                  </div>

                  {/* 5 One-Click Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      disabled={isEnhancing}
                      onClick={() => handleEnhanceComponent('cro_headlines', 'Viết lại Tiêu đề CRO')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 shadow-sm ${
                        activeEnhancement === 'cro_headlines'
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold ring-1 ring-amber-300'
                          : 'bg-slate-800/90 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border-amber-500/30'
                      }`}
                      title="AI viết lại Headline đánh trúng tâm lý, tăng tỷ lệ bấm đăng ký"
                    >
                      {activeEnhancement === 'cro_headlines' ? (
                        <Loader2 className="w-3 h-3 animate-spin text-slate-950" />
                      ) : (
                        <Flame className="w-3 h-3 text-amber-400" />
                      )}
                      <span>Tiêu Đề Hook</span>
                    </button>

                    <button
                      type="button"
                      disabled={isEnhancing}
                      onClick={() => handleEnhanceComponent('doctor_trust', 'Chèn Khối Bác Sĩ & Bằng Cấp')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 shadow-sm ${
                        activeEnhancement === 'doctor_trust'
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold ring-1 ring-cyan-300'
                          : 'bg-slate-800/90 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 border-cyan-500/30'
                      }`}
                      title="Chèn hồ sơ Bác sĩ CKI, kinh nghiệm 15 năm và chứng chỉ quốc tế"
                    >
                      {activeEnhancement === 'doctor_trust' ? (
                        <Loader2 className="w-3 h-3 animate-spin text-slate-950" />
                      ) : (
                        <Award className="w-3 h-3 text-cyan-400" />
                      )}
                      <span>+ Đội Ngũ Bác Sĩ</span>
                    </button>

                    <button
                      type="button"
                      disabled={isEnhancing}
                      onClick={() => handleEnhanceComponent('faq_accordion', 'Chèn Khối FAQ Hỏi Đáp')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 shadow-sm ${
                        activeEnhancement === 'faq_accordion'
                          ? 'bg-indigo-500 text-white border-indigo-400 font-bold ring-1 ring-indigo-300'
                          : 'bg-slate-800/90 hover:bg-slate-700 text-indigo-300 hover:text-indigo-200 border-indigo-500/30'
                      }`}
                      title="Chèn các câu hỏi thường gặp: Trồng răng có đau không? Trả góp thế nào?"
                    >
                      {activeEnhancement === 'faq_accordion' ? (
                        <Loader2 className="w-3 h-3 animate-spin text-white" />
                      ) : (
                        <HelpCircle className="w-3 h-3 text-indigo-400" />
                      )}
                      <span>+ Hỏi Đáp FAQ</span>
                    </button>

                    <button
                      type="button"
                      disabled={isEnhancing}
                      onClick={() => handleEnhanceComponent('countdown_fomo', 'Chèn Đồng Hồ Đếm Ngược')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 shadow-sm ${
                        activeEnhancement === 'countdown_fomo'
                          ? 'bg-rose-500 text-white border-rose-400 font-bold ring-1 ring-rose-300'
                          : 'bg-slate-800/90 hover:bg-slate-700 text-rose-300 hover:text-rose-200 border-rose-500/30'
                      }`}
                      title="Chèn đếm ngược ưu đãi còn 3 suất cuối cùng trong ngày"
                    >
                      {activeEnhancement === 'countdown_fomo' ? (
                        <Loader2 className="w-3 h-3 animate-spin text-white" />
                      ) : (
                        <Clock className="w-3 h-3 text-rose-400" />
                      )}
                      <span>+ Đếm Ngược FOMO</span>
                    </button>

                    <button
                      type="button"
                      disabled={isEnhancing}
                      onClick={() => handleEnhanceComponent('before_after', 'Chèn Khối Trước & Sau')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 shadow-sm ${
                        activeEnhancement === 'before_after'
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold ring-1 ring-emerald-300'
                          : 'bg-slate-800/90 hover:bg-slate-700 text-emerald-300 hover:text-emerald-200 border-emerald-500/30'
                      }`}
                      title="Chèn khối hình ảnh so sánh nụ cười trước & sau điều trị"
                    >
                      {activeEnhancement === 'before_after' ? (
                        <Loader2 className="w-3 h-3 animate-spin text-slate-950" />
                      ) : (
                        <CheckCheck className="w-3 h-3 text-emerald-400" />
                      )}
                      <span>+ Trước &amp; Sau</span>
                    </button>
                  </div>
                </div>

                {enhancementToast && (
                  <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{enhancementToast}</span>
                  </div>
                )}
              </div>
            )}

            {/* Studio Workspace Content Area */}
            <div className="flex-1 bg-slate-950 p-3 sm:p-4 min-h-[520px] flex flex-col justify-center">
              {/* Case 1: Empty state (No HTML generated yet) */}
              {!generatedHtml && !isGenerating && (
                <div className="text-center py-16 px-4 space-y-4 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-950/30">
                    <Wand2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Chưa Có Mã Giao Diện</h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Hãy chọn ảnh chụp màn hình bất kỳ ở cột bên trái hoặc nhấp vào một trong các mẫu nha khoa gợi ý, sau đó bấm <span className="text-amber-400 font-semibold">&quot;Tạo Landing Page Từ Ảnh&quot;</span>.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => handleSelectSample(SAMPLE_TEMPLATES[0])}
                      className="px-4 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-all inline-flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Thử Nhanh Mẫu Implant Tâm Đức</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Case 2: Loading Generating State */}
              {isGenerating && (
                <div className="text-center py-20 px-4 space-y-4 max-w-md mx-auto">
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 animate-ping" />
                    <div className="w-20 h-20 rounded-full border-4 border-t-amber-400 border-r-transparent border-b-cyan-400 border-l-transparent animate-spin flex items-center justify-center" />
                    <Wand2 className="w-8 h-8 text-amber-400 absolute inset-0 m-auto" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">Gemini AI Đang Lập Trình Landing Page</h3>
                    <p className="text-xs text-amber-300 animate-pulse">{generationStep || 'Đang xử lý...'}</p>
                    <p className="text-[11px] text-slate-400">Quá trình thường mất khoảng 8-15 giây để sinh mã HTML5 + Tailwind CSS chuẩn.</p>
                  </div>
                </div>
              )}

              {/* Case 3: Live Preview Tab */}
              {generatedHtml && !isGenerating && activeTab === 'preview' && (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div
                    className={`transition-all duration-300 bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col ${
                      previewDevice === 'mobile'
                        ? 'w-[390px] h-[650px] border-8 border-slate-800 rounded-[36px]'
                        : previewDevice === 'tablet'
                        ? 'w-[768px] h-[650px] border-8 border-slate-800 rounded-[28px]'
                        : 'w-full h-[650px]'
                    }`}
                  >
                    {/* Device Top Bar for Mobile / Tablet */}
                    {previewDevice !== 'desktop' && (
                      <div className="bg-slate-900 text-slate-400 px-4 py-1.5 text-[10px] flex items-center justify-between font-mono shrink-0 select-none">
                        <span>9:41</span>
                        <div className="w-16 h-3 bg-black rounded-full" />
                        <span>5G 100%</span>
                      </div>
                    )}

                    <iframe
                      ref={iframeRef}
                      title="Landing Page Preview"
                      srcDoc={generatedHtml}
                      sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
                      className="w-full flex-1 border-0 bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Case 4: Source Code Tab */}
              {generatedHtml && !isGenerating && activeTab === 'code' && (
                <div className="w-full h-[650px] flex flex-col bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                  <div className="bg-slate-950 px-4 py-2 text-xs text-slate-400 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-cyan-300 font-semibold">
                        {viewCodeType === 'section' ? 'component-section.html' : 'index.html (Đầy đủ)'}
                      </span>
                      <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-[11px]">
                        <button
                          type="button"
                          onClick={() => setViewCodeType('full')}
                          className={`px-2 py-0.5 rounded-md transition-colors ${
                            viewCodeType === 'full' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Toàn bộ HTML5
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewCodeType('section')}
                          className={`px-2 py-0.5 rounded-md transition-colors flex items-center gap-1 ${
                            viewCodeType === 'section' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <Scissors className="w-3 h-3 text-amber-400" />
                          <span>Chỉ Khối Section</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span>
                        {((viewCodeType === 'section' ? (extractedSectionCode || generatedHtml) : generatedHtml).split('\n').length)} dòng mã
                      </span>
                      <button
                        type="button"
                        onClick={viewCodeType === 'section' ? handleCopySectionCode : handleCopyCode}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 border border-slate-700"
                      >
                        <Copy className="w-3 h-3 text-cyan-400" />
                        <span>Sao chép mã đang xem</span>
                      </button>
                    </div>
                  </div>
                  <pre className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-200 leading-relaxed select-all bg-slate-950/60">
                    <code>{viewCodeType === 'section' ? (extractedSectionCode || generatedHtml) : generatedHtml}</code>
                  </pre>
                </div>
              )}

              {/* Case 5: Side-by-side Compare Tab */}
              {generatedHtml && !isGenerating && activeTab === 'compare' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[650px]">
                  {/* Left: Original Screenshot */}
                  <div className="flex flex-col bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                    <div className="bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-300 border-b border-slate-800 flex items-center gap-2">
                      <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Ảnh Mẫu Đối Thủ Đã Tải Lên</span>
                    </div>
                    <div className="flex-1 p-3 overflow-auto bg-slate-950 flex items-center justify-center">
                      {selectedImageBase64 ? (
                        <img
                          src={selectedImageBase64}
                          alt="Ảnh chụp mẫu"
                          className="max-w-full max-h-full object-contain rounded-lg shadow"
                        />
                      ) : (
                        <span className="text-xs text-slate-500">Không có ảnh</span>
                      )}
                    </div>
                  </div>

                  {/* Right: AI Recreated Landing */}
                  <div className="flex flex-col bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                    <div className="bg-slate-950 px-3 py-2 text-xs font-semibold text-emerald-300 border-b border-slate-800 flex items-center gap-2">
                      <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Giao Diện Do AI Code Lại</span>
                    </div>
                    <div className="flex-1 bg-white overflow-hidden">
                      <iframe
                        title="Compare Preview"
                        srcDoc={generatedHtml}
                        sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
                        className="w-full h-full border-0 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Bar: Quick AI Refine Prompt */}
            {generatedHtml && (
              <div className="bg-slate-950 border-t border-slate-800 p-3 sm:p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRefineCode();
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="relative flex-1">
                    <Sparkles className="w-4 h-4 text-amber-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={refinePrompt}
                      onChange={(e) => setRefinePrompt(e.target.value)}
                      placeholder="Nhập yêu cầu tinh chỉnh code (ví dụ: 'Đổi nút bấm sang màu cam rực rỡ', 'Thêm phần Bác sĩ')..."
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isRefining || !refinePrompt.trim()}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                      isRefining || !refinePrompt.trim()
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-950/40'
                    }`}
                  >
                    {isRefining ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                        <span>Đang sửa...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-slate-950" />
                        <span>Sửa Bằng AI</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drawer: Saved Landing Pages Library */}
      {isSavedDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col shadow-2xl overflow-hidden animate-slideIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-cyan-400" />
                <span>Thư Viện Landing Page Đã Lưu ({savedPages.length})</span>
              </h3>
              <button
                onClick={() => setIsSavedDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {savedPages.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-sm">
                  Chưa có landing page nào được lưu. Khi bạn sinh mã mới, hệ thống sẽ tự động lưu vào đây.
                </div>
              ) : (
                savedPages.map((page) => (
                  <div
                    key={page.id}
                    onClick={() => handleLoadSavedPage(page)}
                    className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 line-clamp-1">
                          {page.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {page.brandName} • {page.targetService}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteSavedPage(page.id, e)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 border-t border-slate-800/60">
                      <span>Tạo: {new Date(page.createdAt).toLocaleDateString('vi-VN')}</span>
                      <span className="text-cyan-400 font-medium group-hover:underline flex items-center gap-1">
                        <span>Mở trang</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => setIsSavedDrawerOpen(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
              >
                Đóng Thư Viện
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
