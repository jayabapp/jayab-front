"use client";

import { useTestAccessManager } from "@features/test-access/hooks/useTestAccessManager";
import Button from "@elements/Button";

const TestAccessManager = () => {
  const manager = useTestAccessManager();

  if (manager.isCheckingAccess)
    return <div className="h-64 animate-pulse rounded-20 bg-neutral-100" />;

  if (!manager.canManage)
    return (
      <div className="rounded-20 bg-white p-6 text-center shadow-card">
        شما اجازه مدیریت دسترسی محیط تست را ندارید.
      </div>
    );

  return (
    <section className="flex w-full flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h1 className="text-lg font-bold">دسترسی محیط تست</h1>
        <p className="text-sm text-neutral-600">
          فقط شماره‌های فعال این فهرست اجازه ورود به دامنه تست را دارند.
        </p>
      </header>
      <div className="flex flex-col gap-3 rounded-20 bg-white p-4 shadow-card md:flex-row">
        <input
          dir="ltr"
          inputMode="numeric"
          maxLength={11}
          value={manager.mobile}
          aria-label="شماره موبایل عضو QA"
          placeholder="09123456789"
          onChange={(event) => manager.setMobile(event.target.value.replace(/\D/g, ""))}
          className="min-h-12 flex-1 rounded-xl border border-neutral-200 px-4 text-left outline-none focus:border-brand-600"
        />
        <Button
          title="افزودن عضو QA"
          loading={manager.isCreating}
          disabled={manager.isCreating}
          onClick={manager.addMember}
          containerClass="md:w-44"
          width="w-full"
        />
      </div>
      <div className="overflow-hidden rounded-20 bg-white shadow-card">
        {manager.isLoading ? (
          <div className="h-64 animate-pulse bg-neutral-100" />
        ) : manager.members.length === 0 ? (
          <p className="p-8 text-center text-sm text-neutral-600">
            عضوی در فهرست دسترسی وجود ندارد.
          </p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {manager.members.map((member) => {
              const isTeamLead = member.role === "TEAM_LEAD";
              const isUpdating = manager.updatingId === member.id;
              return (
                <li key={member.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="flex min-w-0 flex-col gap-1">
                    <bdi dir="ltr" className="font-medium">{member.mobile_number}</bdi>
                    <span className="text-xs text-neutral-600">
                      {isTeamLead ? "تیم‌لید" : "عضو QA"} · {member.is_active ? "فعال" : "غیرفعال"}
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled={isTeamLead || isUpdating}
                    onClick={() => manager.setMemberActive({ id: member.id, is_active: !member.is_active })}
                    className={`min-w-24 rounded-xl px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 ${member.is_active ? "bg-danger-50 text-danger-600" : "bg-success-50 text-success-600"}`}
                  >
                    {isUpdating ? "در حال ثبت..." : member.is_active ? "غیرفعال‌کردن" : "فعال‌کردن"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
};

export default TestAccessManager;
