import { useState } from 'react';
import type { TagBehavior } from '@dawn/types';
import { sectionCard, sectionTitle } from '../fields/styles';
import { describeTagBehaviors } from './tagBehaviorSummaries';

export function TagBehaviorReference({
  tagId,
  behaviors,
}: {
  tagId: string;
  behaviors: readonly TagBehavior[];
}) {
  const [showJson, setShowJson] = useState(false);
  const summaries = describeTagBehaviors(behaviors);

  return (
    <section style={{ ...sectionCard, marginTop: 12 }}>
      <h3 style={sectionTitle}>How this tag works</h3>
      <p style={{ margin: '0 0 8px', fontSize: 12, color: '#9aa0b4' }}>
        Source file: <code style={{ color: '#c4c8d4' }}>content/tags/**/{tagId}.json</code>
      </p>
      <ul style={{ margin: '0 0 12px', paddingLeft: 18, fontSize: 13, color: '#ccc' }}>
        {summaries.map((line, index) => (
          <li key={index} style={{ marginBottom: 6 }}>
            {line}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setShowJson((open) => !open)}
        style={{
          background: 'transparent',
          border: '1px solid #444',
          borderRadius: 6,
          color: '#8ab4f8',
          padding: '6px 10px',
          fontSize: 12,
          cursor: 'pointer',
        }}
      >
        {showJson ? 'Hide JSON' : 'Show JSON'}
      </button>
      {showJson ? (
        <pre
          style={{
            marginTop: 10,
            padding: 12,
            background: '#12121a',
            borderRadius: 8,
            fontSize: 11,
            color: '#b8bcc8',
            overflow: 'auto',
            border: '1px solid #2e2e3a',
          }}
        >
          {JSON.stringify({ behaviors }, null, 2)}
        </pre>
      ) : null}
    </section>
  );
}
