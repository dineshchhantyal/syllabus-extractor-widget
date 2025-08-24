```tsx
<div
  key={event.id}
  className={`group rounded-md px-1.5 py-0.5 border text-[12px] font-medium leading-snug truncate cursor-pointer transition-colors ${
    EVENT_TYPE_COLORS[event.type]?.container || 'bg-primary/10 dark:bg-primary/25 border-primary/30 dark:border-primary/40'
  } ${EVENT_TYPE_COLORS[event.type]?.text || 'text-foreground'} hover:brightness-110 focus:outline-none focus:ring-1 focus:ring-primary/60`}
  title={event.title}
  onClick={() => onSelect(event)}
>
  <span className="block truncate">{event.title}</span>
</div>
```