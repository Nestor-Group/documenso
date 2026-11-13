import type { Field } from '@prisma/client';
import { PencilLineIcon } from 'lucide-react';

type EnvelopeSignerFieldEditIconProps = {
  field: Pick<Field, 'positionX' | 'positionY' | 'width' | 'height'>;
};

/**
 * A small pencil at the right edge of an editable field, so a prefilled value reads as
 * something the signer can still change. Purely visual: it does not take clicks, which go
 * to the field underneath.
 *
 * Must be rendered inside the page container, whose size is the page size: the field
 * position and size are percentages of the page.
 */
export const EnvelopeSignerFieldEditIcon = ({ field }: EnvelopeSignerFieldEditIconProps) => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-20 flex items-center justify-end pr-1"
      style={{
        left: `${Number(field.positionX)}%`,
        top: `${Number(field.positionY)}%`,
        width: `${Number(field.width)}%`,
        height: `${Number(field.height)}%`,
      }}
    >
      <PencilLineIcon className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
    </div>
  );
};
