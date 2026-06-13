import { useState } from "react";
import { useConvertArticle } from "@workspace/api-client-react";
import { useClerk, useUser } from "@clerk/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, CheckCircle2, Sparkles, ArrowRight, Loader2, PenTool, Link2, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ConvertInputInputType, ConvertInputStyle } from "@workspace/api-client-react";
import { XhsPreviewButton } from "@/components/XhsPreview";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={`h-8 transition-all duration-300 ${copied ? "border-primary text-primary hover:text-primary hover:bg-primary/5" : ""} ${className}`}
      onClick={handleCopy}
      data-testid="button-copy"
    >
      {copied ? (
        <>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          已复制！
        </>
      ) : (
        <>
          <Copy className="mr-2 h-4 w-4" />
          一键复制
        </>
      )}
    </Button>
  );
}

export default function Home() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [inputType, setInputType] = useState<ConvertInputInputType>("url");
  const [content, setContent] = useState("");
  const [style, setStyle] = useState<ConvertInputStyle>("all");
  
  const convertMutation = useConvertArticle();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    convertMutation.mutate({
      data: {
        inputType,
        content: content.trim(),
        style
      }
    });
  };

  const isPending = convertMutation.isPending;
  const result = convertMutation.data;
  const isError = convertMutation.isError;
  const errorMessage = convertMutation.error?.data?.error || "转换失败，请重试";

  const resultCards = [];
  if (result) {
    if (result.summary) resultCards.push({ id: 'summary', title: '干货总结型', icon: '📚', content: result.summary, desc: '逻辑清晰，直击痛点，适合深度知识分享。' });
    if (result.opinion) resultCards.push({ id: 'opinion', title: '观点争议型', icon: '💡', content: result.opinion, desc: '情绪饱满，引发共鸣，更容易产生评论互动。' });
    if (result.tutorial) resultCards.push({ id: 'tutorial', title: '实操教程型', icon: '🛠', content: result.tutorial, desc: '步骤详细，保姆级指导，收藏价值极高。' });
  }

  return (
    <div className="min-h-[100dvh] w-full bg-background flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      <header className="w-full border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-rose-400 flex items-center justify-center shadow-sm">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">知乎 <ArrowRight className="inline h-4 w-4 mx-0.5 text-muted-foreground" /> 小红书</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              AI 灵感引擎已就绪
            </div>
            {user && (
              <div className="flex items-center gap-2 pl-3 border-l border-border">
                <span className="text-sm text-muted-foreground hidden sm:block">
                  {user.primaryEmailAddress?.emailAddress || user.fullName}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => signOut({ redirectUrl: basePath || "/" })}
                  title="退出登录"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col items-center">
        
        <div className="w-full max-w-2xl flex flex-col items-center mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-balance">
            专业的内容<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-400">重塑工具</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl text-balance">
            将深度深沉的知乎长文，一键转化为爆款小红书笔记。选择你需要的爆款网感风格，让好内容被更多人看见。
          </p>
        </div>

        <Card className="w-full max-w-3xl p-6 md:p-8 shadow-xl shadow-primary/5 border-primary/10 mb-16 relative overflow-hidden bg-card/50 backdrop-blur-sm">
          <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          
          <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">输入内容</Label>
              </div>
              
              <Tabs value={inputType} onValueChange={(v) => setInputType(v as ConvertInputInputType)} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="url" className="data-[state=active]:bg-card data-[state=active]:shadow-sm gap-2">
                    <Link2 className="h-4 w-4" />
                    知乎文章链接
                  </TabsTrigger>
                  <TabsTrigger value="text" className="data-[state=active]:bg-card data-[state=active]:shadow-sm gap-2">
                    <PenTool className="h-4 w-4" />
                    粘贴文章文本
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="url" className="mt-0">
                  <div className="space-y-2">
                    <Input 
                      placeholder="支持专栏、文章、问题回答、想法链接…" 
                      value={inputType === "url" ? content : ""}
                      onChange={(e) => setContent(e.target.value)}
                      className="h-14 px-4 text-base bg-card shadow-sm border-muted-foreground/20 focus-visible:ring-primary/30"
                      data-testid="input-url"
                    />
                    <p className="text-xs text-muted-foreground px-1">
                      支持：专栏文章 <code className="bg-muted px-1 rounded text-[11px]">zhuanlan.zhihu.com/p/…</code>、
                      问题回答 <code className="bg-muted px-1 rounded text-[11px]">zhihu.com/question/…/answer/…</code>、
                      想法 <code className="bg-muted px-1 rounded text-[11px]">zhihu.com/pin/…</code>
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="text" className="mt-0">
                  <Textarea 
                    placeholder="在此粘贴知乎文章的正文内容..." 
                    value={inputType === "text" ? content : ""}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[140px] resize-y p-4 text-base bg-card shadow-sm border-muted-foreground/20 focus-visible:ring-primary/30"
                    data-testid="input-text"
                  />
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-semibold">选择生成风格</Label>
              <RadioGroup 
                value={style} 
                onValueChange={(v) => setStyle(v as ConvertInputStyle)}
                className="grid grid-cols-2 md:grid-cols-4 gap-3"
              >
                {[
                  { value: "all", label: "全部生成", desc: "一次看三款" },
                  { value: "summary", label: "干货总结型", desc: "逻辑清晰" },
                  { value: "opinion", label: "观点争议型", desc: "情绪饱满" },
                  { value: "tutorial", label: "实操教程型", desc: "步骤详尽" },
                ].map((item) => (
                  <Label 
                    key={item.value}
                    htmlFor={`style-${item.value}`}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-muted/50 ${
                      style === item.value 
                        ? "border-primary bg-primary/5 text-primary" 
                        : "border-transparent bg-muted/30 text-muted-foreground"
                    }`}
                  >
                    <RadioGroupItem value={item.value} id={`style-${item.value}`} className="sr-only" />
                    <span className="font-semibold mb-1">{item.label}</span>
                    <span className="text-xs opacity-80">{item.desc}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            {isError && (
              <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm font-medium flex items-center gap-2 border border-destructive/20 animate-in fade-in slide-in-from-top-2">
                <Sparkles className="h-4 w-4" />
                {errorMessage}
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isPending || !content.trim()} 
              className="h-14 text-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
              data-testid="button-submit"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  AI 正在创作中...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  一键转换
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {(isPending || result) && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full flex flex-col items-center"
            >
              <div className="w-full max-w-6xl">
                {result && (
                  <div className="mb-8 text-center md:text-left">
                    <h2 className="text-2xl font-bold">转换结果</h2>
                    {result.title && <p className="text-muted-foreground mt-2 font-medium">原文：{result.title}</p>}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  {isPending ? (
                    <>
                      <SkeletonCard delay={0} />
                      <SkeletonCard delay={0.1} />
                      <SkeletonCard delay={0.2} />
                    </>
                  ) : (
                    resultCards.map((card, index) => (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
                        className="h-full"
                      >
                        <Card className="h-full flex flex-col border-border/50 hover:border-primary/30 transition-colors duration-300 shadow-sm hover:shadow-md bg-card">
                          <div className="p-5 border-b border-border/50 flex items-center justify-between bg-muted/10">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl" role="img" aria-label={card.title}>{card.icon}</span>
                              <div>
                                <h3 className="font-bold text-base">{card.title}</h3>
                                <p className="text-xs text-muted-foreground">{card.desc}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <XhsPreviewButton content={card.content} cardType={card.title} />
                              <CopyButton text={card.content} />
                            </div>
                          </div>
                          <div className="p-6 flex-1">
                            <div className="prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-p:mb-4 max-w-none whitespace-pre-wrap text-foreground/90">
                              {card.content}
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

function SkeletonCard({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col border-border/50 shadow-sm bg-card overflow-hidden">
        <div className="p-5 border-b border-border/50 flex items-center justify-between bg-muted/10">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
        <div className="p-6 flex-1 space-y-4">
          <Skeleton className="h-4 w-[85%]" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[75%]" />
          <div className="pt-4 space-y-4">
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[85%]" />
          </div>
          <div className="pt-4 space-y-4">
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[85%]" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
