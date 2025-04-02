<?php

namespace App\Entity;

use App\Repository\LeadRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: LeadRepository::class)]
class Lead
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "SEQUENCE")]
    #[ORM\SequenceGenerator(sequenceName: "lead_id_seq")]
    #[ORM\Column]
    #[Groups(['lead_compact'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['lead_compact'])]
    private ?string $title = null;

    #[ORM\Column(length: 255)]
    #[Groups(['lead_compact'])]
    private ?string $fullname = null;

    #[ORM\Column(length: 25)]
    #[Groups(['lead_compact'])]
    private ?string $phone = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['lead_compact'])]
    private ?string $email = null;

    #[ORM\ManyToOne(cascade: ['persist'], inversedBy: 'leads')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['lead_compact'])]
    private ?Status $status = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['lead_compact'])]
    private ?string $description = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getFullname(): ?string
    {
        return $this->fullname;
    }

    public function setFullname(string $fullname): static
    {
        $this->fullname = $fullname;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(string $phone): static
    {
        $this->phone = $phone;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getStatus(): ?Status
    {
        return $this->status;
    }

    public function setStatus(?Status $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }
}
