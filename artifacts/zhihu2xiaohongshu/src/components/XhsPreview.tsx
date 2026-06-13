import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2, Heart, Star, MessageCircle, Share2, ArrowLeft, MoreHorizontal, Smartphone } from "lucide-react";

interface XhsPreviewProps {
  open: boolean;
  onClose: () => void;
  content: string;
  cardType: string;
}

function parseXhsContent(raw: string): { title: string; body: string; tags: string[] } {
  const lines = raw.split("\n").filter((l) => l.trim() !== "");

  const tagLines: string[] = [];
  const bodyLines: string[] = [];
  let title = "";

  for (const line of lines) {
    // Collect hashtag-only lines (e.g. "#标签 #标签2")
    if (/^(#\S+\s*)+$/.test(line.trim())) {
      const found = line.trim().match(/#\S+/g) || [];
      tagLines.push(...found);
    } else {
      bodyLines.push(line);
    }
  }

  // Also collect inline tags from the last body line
  const lastLine = bodyLines[bodyLines.length - 1] ?? "";
  if (lastLine && /^(#\S+\s*)+$/.test(lastLine.trim())) {
    const found = lastLine.match(/#\S+/g) || [];
    tagLines.push(...found);
    bodyLines.pop();
  }

  title = bodyLines[0] ?? "";
  const body = bodyLines.slice(1).join("\n");

  return {
    title,
    body,
    tags: [...new Set(tagLines)],
  };
}

function renderBody(body: string) {
  return body.split("\n").map((line, i) => {
    const parts = line.split(/(#\S+)/g);
    return (
      <p key={i} className={`leading-[1.75] ${line === "" ? "h-3" : ""}`}>
        {parts.map((part, j) =>
          part.startsWith("#") ? (
            <span key={j} className="text-[#FE2C55] font-medium">
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </p>
    );
  });
}

const COVER_GRADIENTS: Record<string, string> = {
  "干货总结型": "from-blue-400 via-indigo-400 to-violet-500",
  "观点争议型": "from-rose-400 via-pink-400 to-red-500",
  "实操教程型": "from-emerald-400 via-teal-400 to-cyan-500",
};

const COVER_EMOJIS: Record<string, string> = {
  "干货总结型": "📚",
  "观点争议型": "💡",
  "实操教程型": "🛠️",
};

export function XhsPreviewModal({ open, onClose, content, cardType }: XhsPreviewProps) {
  const [copied, setCopied] = useState(false);
  const { title, body, tags } = parseXhsContent(content);
  const gradient = COVER_GRADIENTS[cardType] ?? "from-rose-400 via-pink-400 to-red-500";
  const emoji = COVER_EMOJIS[cardType] ?? "✨";

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[400px] p-0 overflow-hidden bg-transparent border-none shadow-none flex flex-col items-center gap-4">
        {/* Phone frame */}
        <div
          className="relative w-[340px] bg-white rounded-[40px] overflow-hidden shadow-2xl"
          style={{
            boxShadow: "0 0 0 10px #1a1a1a, 0 30px 60px rgba(0,0,0,0.5)",
          }}
        >
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1a1a1a] rounded-b-2xl z-20" />

          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pt-7 pb-1 bg-white z-10 relative">
            <span className="text-[11px] font-semibold text-gray-800">9:41</span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-gray-800">●●●</span>
              <span className="text-[10px] text-gray-800">WiFi</span>
              <span className="text-[10px] text-gray-800">🔋</span>
            </div>
          </div>

          {/* XHS nav bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-100">
            <button className="p-1">
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
            <span className="text-sm font-semibold text-gray-800">笔记详情</span>
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-gray-600" />
              <MoreHorizontal className="h-4 w-4 text-gray-600" />
            </div>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto max-h-[520px] bg-[#f8f8f8]">
            {/* Cover image */}
            <div
              className={`w-full aspect-[4/3] bg-gradient-to-br ${gradient} flex flex-col items-center justify-center gap-3`}
            >
              <span className="text-6xl drop-shadow-md">{emoji}</span>
              <p className="text-white/90 text-sm font-medium px-6 text-center leading-snug line-clamp-2 drop-shadow">
                {title}
              </p>
            </div>

            {/* Author row */}
            <div className="flex items-center justify-between px-4 py-3 bg-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                  我
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-none">我的账号</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">刚刚发布</p>
                </div>
              </div>
              <button className="px-3 py-1 rounded-full border border-[#FE2C55] text-[#FE2C55] text-xs font-semibold">
                + 关注
              </button>
            </div>

            {/* Content */}
            <div className="px-4 pb-4 bg-white mt-0.5">
              {/* Title */}
              <h2 className="text-[15px] font-bold text-gray-900 leading-snug mb-2">
                {title}
              </h2>

              {/* Body */}
              <div className="text-[13px] text-gray-700 space-y-0">
                {renderBody(body)}
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {tags.map((tag) => (
                    <span key={tag} className="text-[12px] text-[#FE2C55] font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Interaction bar */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-4">
              <div className="flex-1 flex items-center gap-4">
                <button className="flex items-center gap-1 text-gray-500">
                  <Heart className="h-5 w-5" />
                  <span className="text-xs">赞</span>
                </button>
                <button className="flex items-center gap-1 text-gray-500">
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-xs">评论</span>
                </button>
                <button className="flex items-center gap-1 text-gray-500">
                  <Star className="h-5 w-5" />
                  <span className="text-xs">收藏</span>
                </button>
              </div>
              <button className="flex items-center gap-1 text-gray-500">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Home indicator */}
          <div className="bg-white flex justify-center py-2">
            <div className="w-28 h-1 bg-gray-800 rounded-full" />
          </div>
        </div>

        {/* Copy button below phone */}
        <Button
          onClick={handleCopy}
          className={`w-[340px] h-11 font-semibold text-sm transition-all duration-300 ${
            copied
              ? "bg-emerald-500 hover:bg-emerald-600"
              : "bg-[#FE2C55] hover:bg-[#e01f45]"
          } text-white shadow-lg`}
        >
          {copied ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              已复制！去小红书粘贴发布
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              一键复制全文 · 粘贴即发布
            </>
          )}
        </Button>

        <p className="text-xs text-white/70 text-center -mt-1">
          在小红书网页端或 App 发布页粘贴，格式完全保留
        </p>
      </DialogContent>
    </Dialog>
  );
}

export function XhsPreviewButton({ content, cardType }: { content: string; cardType: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 text-[#FE2C55] border-[#FE2C55]/30 hover:bg-[#FE2C55]/5 hover:border-[#FE2C55]/60"
        onClick={() => setOpen(true)}
      >
        <Smartphone className="h-3.5 w-3.5" />
        手机预览
      </Button>
      <XhsPreviewModal
        open={open}
        onClose={() => setOpen(false)}
        content={content}
        cardType={cardType}
      />
    </>
  );
}
