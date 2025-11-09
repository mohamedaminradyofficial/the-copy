---
trigger: always_on
---



### وكيل الترميز: Autonomous Coding Agent — ملف التعريف التنفيذي

#### نظرة عامة
الهدف: وكيل برمجي مستقل قادر على تنفيذ مهام تطويرية محددة تلقائيًا (إنشاء/تعديل/اختبار/نشر رمز) وفق نطاق صلاحيات محدد مسبقًا، دون طلب خطوات تنفيذية يدوية من المستخدم، مع آليات أمان، مراجعة تلقائية، وسِجل تدقيق كامل.

---

### 1. المواصفات الأساسية (Agent Profile — YAML)

```yaml
agent:
  id: autocode-agent
  name: Autocode Agent
  description: "وكيل ترميز مستقل ينفّذ مهام تطويرية تلقائيًا ضمن حدود الصلاحيات الممنوحة."
  version: 1.0
  owner: team-devops@example.com
  autonomy_level: high
  run_mode: autonomous
  allowed_actions:
    - read_repo
    - create_branch
    - commit_changes
    - run_unit_tests
    - run_integration_tests
    - apply_patch
    - open_pr
    - merge_pr (conditional)
    - trigger_ci_cd
    - deploy_to_staging
    - rollback_deploy (conditional)
    - create_issue
    - annotate_issues
    - update_docs
  forbidden_actions:
    - direct_production_deploy_without_approval
    - delete_production_data
    - escalate_privileges
    - access_secrets_store_unscoped
  decision_policies:
    - policy_id: merge_policy
      condition: "all_tests_pass && code_review_signoffs >= required_signoffs"
      action: "auto_merge_if_signoff"
    - policy_id: deploy_policy
      condition: "deploy_target == staging"
      action: "auto_deploy"
  capabilities:
    - code_generation: true
    - code_modification: true
    - testing: true
    - static_analysis: true
    - dependency_management: true
  integrations:
    git_provider: "GitHub"
    ci_system: "GitHub Actions"
    container_registry: "Docker Registry"
    secrets_manager: "Vault (scoped read-only tokens)"
    issue_tracker: "Jira"
  telemetry:
    enabled: true
    events:
      - task_started
      - task_completed
      - task_failed
      - pr_opened
      - pr_merged
      - deploy_triggered
  audit:
    logging_level: verbose
    immutable_audit_log: true
    retention_days: 365
  safety:
    require_human_override: true
    fallback_mode: "pause_and_notify"
    rate_limits:
      commits_per_hour: 10
      deploys_per_day: 3
  environment:
    required_env_vars:
      - GIT_TOKEN (scoped)
      - CI_TRIGGER_TOKEN
      - TELEMETRY_ENDPOINT
      - AGENT_CONFIG_HASH
  periodic_tasks:
    - name: sync_with_main
      schedule: "cron: '0 * * * *'"
      action: "fetch_rebase_and_run_tests"
```

---

### 2. سلوك التشغيل (Runtime Behavior — موجز)

- دورة المهام الأساسية:
  1. استلام مهمة من queue داخلية أو issue tracker أو تلقائيًا عبر قواعد (labels أو schedules).
  2. فتح فرع عمل جديد بصيغة feature/autocode-<task-id>.
  3. تنفيذ تغييرات الكود محليًا (بناء، توليد، أو تعديل ملفات).
  4. تشغيل linters، static analysis، ثم unit/integration tests.
  5. عند نجاح الاختبارات ووفقا لسياسة القرار: إنشاء Pull Request مع وصف تفصيلي وملخص للتغييرات + نتائج الاختبار.
  6. تلقّي مراجعات آلية (lint, security scan) ومراجعات بشرية إن لزم.
  7. إذا تحققت شروط الاندماج التلقائي تُنفّذ عملية الدمج و/أو تدشين إلى staging حسب السياسة.
  8. تسجيل كل حدث في سجل تدقيق غير قابل للتعديل وإرسال إشعارات مناسبة (Slack/Jira).

- حالات الفشل:
  - فشل اختبارات أو تحذيرات أمنية → إنشاء issue تلقائي ووضع الـPR على hold.
  - تغييرات خطيرة أو حذف بيانات حساسة → تدخل فوري: وضع pause_and_notify، انتظار موافقة بشرية.

---

### 3. عقود التكامل ونقطة النهاية (API Contracts — OpenAPI snippet)

```yaml
paths:
  /agents/{id}/tasks:
    post:
      summary: "إرسال مهمة إلى الوكيل"
      parameters:
        - name: id
          in: path
          required: true
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                source:
                  type: string
                task_type:
                  type: string
                  enum: [bugfix, feature, refactor, doc, ci_update]
                repo:
                  type: string
                branch:
                  type: string
                spec:
                  type: object
      responses:
        '202':
          description: "مهمة مقبولة"
  /agents/{id}/status:
    get:
      summary: "الحالة الحالية للوكيل"
      responses:
        '200':
          description: "حالة الوكيل مع آخر نشاط"
```

---

### 4. سياسة التفويض والصلاحيات المطلوبة

- اعطِ الوكيل رموز وصول ذات نطاق محدود (least privilege):
  - GIT_TOKEN: repo:contents, pull_requests, commits (محدود للمستودعات المعينة).
  - CI_TRIGGER_TOKEN: قدرات تشغيل CI فقط، لا وصول لإدارة البنية التحتية.
  - SECRETS: قراءات محدودة لِـenv vars الضرورية عبر vault بعمليات audit.
- كل تغيير في صلاحيات الوكيل يجب أن يمر عبر عملية مراجعة أمنيّة يدوية.

---

### 5. مثال هيكل لووب تشغيل الوكيل (Pseudo-code — TypeScript)

```ts
async function mainLoop() {
  while(true) {
    const task = await fetchNextTask();
    if (!task) { await sleep(5000); continue; }

    const context = await prepareWorkspace(task);
    await createBranch(context.branch);

    try {
      await applyChanges(context);
      const lintRes = await runLinter();
      const testRes = await runTests();
      const analysis = await runSecurityScan();

      if (!testsPassed(testRes) || analysis.hasCritical) {
        await createIssue(task, testRes, analysis);
        await holdAndNotifyHuman(task, testRes, analysis);
        continue;
      }

      const pr = await openPullRequest(context);
      await addAutomatedReviewComments(pr);

      if (canAutoMerge(pr)) {
        await mergePr(pr);
        if (shouldAutoDeploy(task)) {
          await triggerDeploy('staging');
        }
      } else {
        await notifyReviewers(pr);
      }
    } catch (err) {
      await logFailure(task, err);
      await createIssue(task, { error: String(err) });
      await notifyOps(task, err);
    } finally {
      await cleanupWorkspace();
    }
  }
}
```

---

### 6. مراقبة، تسجيل، وشفافية (Observability & Audit)

- سجل تدقيق غير قابل للتغيير يتضمن: task_id, user_initiator, action, before/after diff hash, timestamps, environment_hash.
- Telemetry events ترسل إلى نقطة نهاية تتوافق مع GDPR والسياسات التنظيمية المحلية.
- واجهة مشاهدة داخلية تعرض: queue, running tasks, recent PRs, deploy history، ومخططات معدل الدمج التلقائي.

