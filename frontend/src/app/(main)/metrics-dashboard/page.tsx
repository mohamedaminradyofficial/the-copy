"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Database, Server, Clock, TrendingUp, AlertTriangle } from "lucide-react";

interface MetricsDashboardData {
  timestamp: string;
  overview: {
    totalRequests: number;
    avgResponseTime: number;
    errorRate: number;
    activeJobs: number;
    cacheHitRatio: number;
  };
  database: {
    totalQueries: number;
    avgDuration: number;
    slowQueries: number;
  };
  redis: {
    hitRatio: number;
    hits: number;
    misses: number;
    memoryUsage: number;
  };
  queue: {
    total: number;
    active: number;
    completed: number;
    failed: number;
  };
  resources: {
    cpu: { usage: number; status: string };
    memory: { used: number; total: number; percent: number; status: string };
    concurrentRequests: number;
  };
  gemini: {
    totalRequests: number;
    avgDuration: number;
    cacheHitRatio: number;
    errorRate: number;
  };
}

export default function MetricsDashboardPage() {
  const [metrics, setMetrics] = useState<MetricsDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchMetrics = async () => {
    try {
      const response = await fetch("/api/metrics/dashboard", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch metrics");
      }

      const data = await response.json();
      if (data.success) {
        setMetrics(data.data);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ في جلب البيانات");
      console.error("Failed to fetch metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();

    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
    return undefined;
  }, [autoRefresh]);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "ok":
      case "healthy":
        return "text-green-600";
      case "warning":
      case "degraded":
        return "text-yellow-600";
      case "critical":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">جاري تحميل المقاييس...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">خطأ</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <button
              onClick={fetchMetrics}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              إعادة المحاولة
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">لوحة مراقبة المقاييس</h1>
          <p className="text-muted-foreground mt-1">
            آخر تحديث: {new Date(metrics.timestamp).toLocaleString("ar-EG")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchMetrics}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            تحديث الآن
          </button>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">تحديث تلقائي</span>
          </label>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.overview.totalRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              معدل الخطأ: {(metrics.overview.errorRate * 100).toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">زمن الاستجابة</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.overview.avgResponseTime.toFixed(0)}ms</div>
            <p className="text-xs text-muted-foreground mt-1">متوسط زمن الاستجابة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">نسبة التخزين المؤقت</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(metrics.overview.cacheHitRatio * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">نسبة نجاح التخزين المؤقت</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المهام النشطة</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.overview.activeJobs}</div>
            <p className="text-xs text-muted-foreground mt-1">مهام قيد التنفيذ</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics Tabs */}
      <Tabs defaultValue="database" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="database">قاعدة البيانات</TabsTrigger>
          <TabsTrigger value="redis">Redis</TabsTrigger>
          <TabsTrigger value="queue">الطوابير</TabsTrigger>
          <TabsTrigger value="resources">الموارد</TabsTrigger>
          <TabsTrigger value="gemini">Gemini AI</TabsTrigger>
        </TabsList>

        {/* Database Metrics */}
        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>مقاييس قاعدة البيانات</CardTitle>
              <CardDescription>أداء الاستعلامات وإحصائيات قاعدة البيانات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">إجمالي الاستعلامات</p>
                    <p className="text-2xl font-bold">{metrics.database.totalQueries.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">متوسط المدة</p>
                    <p className="text-2xl font-bold">{metrics.database.avgDuration.toFixed(2)}ms</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">الاستعلامات البطيئة</p>
                    <p className="text-2xl font-bold text-yellow-600">{metrics.database.slowQueries}</p>
                  </div>
                </div>
                {metrics.database.slowQueries > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-md">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <p className="text-sm text-yellow-600">
                      تم اكتشاف استعلامات بطيئة. يُنصح بمراجعة الفهارس وتحسين الاستعلامات.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Redis Metrics */}
        <TabsContent value="redis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>مقاييس Redis</CardTitle>
              <CardDescription>أداء التخزين المؤقت وإحصائيات Redis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">نسبة النجاح</p>
                    <p className="text-2xl font-bold text-green-600">
                      {(metrics.redis.hitRatio * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">النجاحات</p>
                    <p className="text-2xl font-bold">{metrics.redis.hits.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">الإخفاقات</p>
                    <p className="text-2xl font-bold">{metrics.redis.misses.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">استخدام الذاكرة</p>
                    <p className="text-2xl font-bold">{formatBytes(metrics.redis.memoryUsage)}</p>
                  </div>
                </div>
                {metrics.redis.hitRatio < 0.7 && (
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-md">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <p className="text-sm text-yellow-600">
                      نسبة نجاح التخزين المؤقت منخفضة. يُنصح بزيادة مدة الصلاحية (TTL) أو تحسين مفاتيح التخزين.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Queue Metrics */}
        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>مقاييس الطوابير</CardTitle>
              <CardDescription>حالة المهام وإحصائيات الطوابير</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">إجمالي المهام</p>
                    <p className="text-2xl font-bold">{metrics.queue.total.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">النشطة</p>
                    <p className="text-2xl font-bold text-blue-600">{metrics.queue.active}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">المكتملة</p>
                    <p className="text-2xl font-bold text-green-600">{metrics.queue.completed}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">الفاشلة</p>
                    <p className="text-2xl font-bold text-red-600">{metrics.queue.failed}</p>
                  </div>
                </div>
                {metrics.queue.failed > metrics.queue.completed * 0.1 && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950 rounded-md">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <p className="text-sm text-red-600">
                      معدل فشل المهام مرتفع. يُرجى مراجعة سجلات الأخطاء وتحسين معالجة الأخطاء.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Metrics */}
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>مقاييس الموارد</CardTitle>
              <CardDescription>استخدام موارد النظام والخادم</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">استخدام المعالج</p>
                    <p className={`text-2xl font-bold ${getStatusColor(metrics.resources.cpu.status)}`}>
                      {metrics.resources.cpu.usage.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">الحالة: {metrics.resources.cpu.status}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">استخدام الذاكرة</p>
                    <p className={`text-2xl font-bold ${getStatusColor(metrics.resources.memory.status)}`}>
                      {metrics.resources.memory.percent.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(metrics.resources.memory.used)} / {formatBytes(metrics.resources.memory.total)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">الطلبات المتزامنة</p>
                    <p className="text-2xl font-bold">{metrics.resources.concurrentRequests}</p>
                  </div>
                </div>
                {(metrics.resources.cpu.status !== "ok" || metrics.resources.memory.status !== "ok") && (
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-md">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <p className="text-sm text-yellow-600">
                      استخدام موارد النظام مرتفع. يُنصح بمراقبة الأداء والنظر في التوسع الأفقي.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gemini AI Metrics */}
        <TabsContent value="gemini" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>مقاييس Gemini AI</CardTitle>
              <CardDescription>أداء واستخدام Gemini API</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
                    <p className="text-2xl font-bold">{metrics.gemini.totalRequests.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">متوسط المدة</p>
                    <p className="text-2xl font-bold">{metrics.gemini.avgDuration.toFixed(0)}ms</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">نسبة التخزين المؤقت</p>
                    <p className="text-2xl font-bold text-green-600">
                      {(metrics.gemini.cacheHitRatio * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">معدل الخطأ</p>
                    <p className="text-2xl font-bold text-red-600">
                      {(metrics.gemini.errorRate * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
