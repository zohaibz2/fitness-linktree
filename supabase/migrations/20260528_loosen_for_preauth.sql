-- Dev-only loosening so the plan builder can save without auth wired up.
-- Revert these once trainer/client auth lands.

alter table clients drop constraint clients_id_fkey;
alter table clients alter column id set default uuid_generate_v4();
alter table clients alter column email drop not null;

alter table plans alter column trainer_id drop not null;
