import { Link } from "wouter";
import { Sparkles, ArrowRight, BookOpen, MessageSquare, GraduationCap, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-[100dvh] w-full bg-background flex flex-col font-sans">
      <header className="w-full border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-rose-400 flex items-center justify-center shadow-sm">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              知乎 <ArrowRight className="inline h-4 w-4 mx-0.5 text-muted-foreground" /> 小红书
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" className="font-medium">
                登录
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="font-semibold shadow-sm">
                免费注册
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center">
        <section className="w-full max-w-5xl mx-auto px-4 md:px-6 pt-20 pb-24 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20">
            <Zap className="h-3.5 w-3.5" />
            DeepSeek AI 驱动
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-balance leading-tight">
            将知乎深度内容<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-400">
              一键变成爆款笔记
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 text-balance leading-relaxed">
            粘贴知乎文章链接或正文，AI 自动生成干货总结、观点争议、实操教程三种小红书风格笔记，让好内容被更多人看见。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="h-12 px-8 text-base font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                <Sparkles className="mr-2 h-5 w-5" />
                免费开始使用
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base font-semibold">
                已有账号，立即登录
              </Button>
            </Link>
          </div>
        </section>

        <section className="w-full max-w-5xl mx-auto px-4 md:px-6 pb-24">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            三种爆款风格，一次全搞定
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <BookOpen className="h-6 w-6" />,
                emoji: "📚",
                title: "干货总结型",
                desc: "要点罗列，逻辑清晰，适合收藏，传递专业价值感。",
                color: "from-blue-500/10 to-indigo-500/10 border-blue-200",
                iconColor: "text-blue-500",
              },
              {
                icon: <MessageSquare className="h-6 w-6" />,
                emoji: "💡",
                title: "观点争议型",
                desc: "颠覆认知，情绪饱满，引发讨论，互动评论极高。",
                color: "from-primary/10 to-rose-500/10 border-primary/20",
                iconColor: "text-primary",
              },
              {
                icon: <GraduationCap className="h-6 w-6" />,
                emoji: "🛠",
                title: "实操教程型",
                desc: "步骤详细，保姆级指导，收藏价值极高，精准吸粉。",
                color: "from-emerald-500/10 to-green-500/10 border-emerald-200",
                iconColor: "text-emerald-500",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`p-6 rounded-2xl border bg-gradient-to-br ${item.color} flex flex-col gap-4`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm ${item.iconColor}`}>
                  <span className="text-2xl">{item.emoji}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="w-full bg-gradient-to-br from-primary/5 to-rose-50 border-t border-primary/10 py-20">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">立即开始，免费使用</h2>
            <p className="text-muted-foreground mb-8">注册账号后即可使用全部功能，无需信用卡。</p>
            <Link href="/sign-up">
              <Button size="lg" className="h-12 px-10 text-base font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                <Sparkles className="mr-2 h-5 w-5" />
                免费注册
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="w-full border-t py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 知乎转小红书 · AI 内容创作工具
        </div>
      </footer>
    </div>
  );
}
