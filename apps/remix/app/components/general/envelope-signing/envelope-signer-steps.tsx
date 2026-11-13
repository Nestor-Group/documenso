import { isRequiredField } from '@documenso/lib/utils/advanced-fields-helpers';
import { isSignatureFieldType } from '@documenso/prisma/guards/is-signature-field';
import { cn } from '@documenso/ui/lib/utils';
import { Trans, useLingui } from '@lingui/react/macro';
import { RecipientRole } from '@prisma/client';
import { CheckIcon } from 'lucide-react';
import { type ReactNode, useMemo } from 'react';

import { useRequiredEnvelopeSigningContext } from '../document-signing/envelope-signing-provider';

type EnvelopeSignerStepState = 'done' | 'current' | 'upcoming';

/**
 * A short list of the steps a signer goes through: check the (non-signature) details, sign the
 * signature field(s), then complete.
 *
 * - Checking the details is the current step when the page opens, also when every field is
 *   already filled in. It is done once no required non-signature field is empty and the signer
 *   has a signature ready in the signature pad or has signed a signature field.
 * - Signing is done when every signature field of the recipient is signed.
 * - Completing is the current step once both are done.
 *
 * Only shown to signers with at least one signature field. The step to check the details is
 * left out when the recipient has no required non-signature fields.
 */
export const EnvelopeSignerSteps = ({ className }: { className?: string }) => {
  const { t } = useLingui();

  const { recipient, recipientFields, signature } = useRequiredEnvelopeSigningContext();

  const signatureFields = useMemo(
    () => recipientFields.filter((field) => isSignatureFieldType(field.type)),
    [recipientFields],
  );

  const steps = useMemo(() => {
    const detailFields = recipientFields.filter((field) => !isSignatureFieldType(field.type) && isRequiredField(field));

    const items: { key: string; label: ReactNode; isDone: boolean }[] = [];

    if (detailFields.length > 0) {
      const hasStartedSigning = Boolean(signature) || signatureFields.some((field) => field.inserted);

      items.push({
        key: 'details',
        label: <Trans>Check your details</Trans>,
        isDone: hasStartedSigning && detailFields.every((field) => field.inserted),
      });
    }

    items.push({
      key: 'signature',
      label: <Trans>Click the signature field and sign</Trans>,
      isDone: signatureFields.every((field) => field.inserted),
    });

    items.push({
      key: 'complete',
      label: <Trans>Click Complete</Trans>,
      isDone: false,
    });

    const currentIndex = items.findIndex((item) => !item.isDone);

    return items.map((item, index) => {
      const state: EnvelopeSignerStepState = item.isDone ? 'done' : index === currentIndex ? 'current' : 'upcoming';

      return { ...item, state };
    });
  }, [recipientFields, signatureFields, signature]);

  if (recipient.role !== RecipientRole.SIGNER || signatureFields.length === 0) {
    return null;
  }

  return (
    <ol aria-label={t`Signing steps`} className={cn('flex flex-wrap items-center justify-center gap-2', className)}>
      {steps.map((step, index) => (
        <li
          key={step.key}
          aria-current={step.state === 'current' ? 'step' : undefined}
          className={cn('inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs', {
            'border-border bg-muted text-muted-foreground': step.state === 'done',
            'border-primary bg-background font-semibold text-foreground ring-1 ring-primary': step.state === 'current',
            'border-border bg-background text-muted-foreground': step.state === 'upcoming',
          })}
        >
          <span
            aria-hidden="true"
            className={cn('flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px]', {
              'bg-primary text-primary-foreground': step.state !== 'upcoming',
              'border border-border': step.state === 'upcoming',
            })}
          >
            {step.state === 'done' ? <CheckIcon className="h-3 w-3" /> : index + 1}
          </span>

          <span>{step.label}</span>

          {step.state === 'done' && (
            <span className="sr-only">
              <Trans>Completed</Trans>
            </span>
          )}
        </li>
      ))}
    </ol>
  );
};
