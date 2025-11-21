"""init

Revision ID: fdff5923b8de
Revises:
Create Date: 2025-11-08 19:13:15.332595

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "fdff5923b8de"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table("styles", schema=None) as batch_op:
        batch_op.alter_column(
            "prompt",
            existing_type=sa.String(length=500),
            type_=sa.String(length=2000),
            existing_nullable=False,
        )


def downgrade() -> None:
    with op.batch_alter_table("styles", schema=None) as batch_op:
        batch_op.alter_column(
            "prompt",
            existing_type=sa.String(length=2000),
            type_=sa.String(length=500),
            existing_nullable=False,
        )
