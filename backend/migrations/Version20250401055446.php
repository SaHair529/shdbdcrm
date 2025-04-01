<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250401055446 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE SEQUENCE lead_id_seq INCREMENT BY 1 MINVALUE 1 START 1
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE lead (id INT NOT NULL, status_id INT NOT NULL, title VARCHAR(255) NOT NULL, fullname VARCHAR(255) NOT NULL, phone VARCHAR(25) NOT NULL, email VARCHAR(255) DEFAULT NULL, description TEXT DEFAULT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_289161CB6BF700BD ON lead (status_id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE lead ADD CONSTRAINT FK_289161CB6BF700BD FOREIGN KEY (status_id) REFERENCES status (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE SCHEMA public
        SQL);
        $this->addSql(<<<'SQL'
            DROP SEQUENCE lead_id_seq CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE lead DROP CONSTRAINT FK_289161CB6BF700BD
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE lead
        SQL);
    }
}
