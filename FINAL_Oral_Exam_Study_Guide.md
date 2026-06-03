# Security of Computer Networks and Clouds -- Oral Exam Study Guide

---

# 1. Network Security Fundamentals

## 1.1 What Is Network Security?

**Network security** is a comprehensive framework of technologies, processes, and policies designed to protect the **integrity**, **confidentiality**, and **availability** of networked systems and data spanning on-premises infrastructure, cloud environments, and hybrid architectures.

Its primary goals are to:

- Protect data integrity
- Ensure confidentiality
- Maintain availability
- Control access
- Detect and respond to threats
- Enable compliance

---

## 1.2 The CIA Triad

The **CIA triad** is the foundational model of information security. Every security control, policy, or technology ultimately serves one or more of these three pillars.

### 1.2.1 Confidentiality

**Confidentiality** means preventing unauthorized access to or disclosure of sensitive information.

- **Data Confidentiality:** Only authorized users can read or access the data.
- **Privacy:** Controls how personal data is collected, stored, and disclosed (relevant regulations: GDPR, CCPA).
- Technologies that support confidentiality: encryption, access control lists (ACLs), VPNs, MFA.

### 1.2.2 Integrity

**Integrity** means ensuring that information is modified only by authorized processes in authorized ways.

- **Data Integrity:** Information has not been altered in transit or at rest by unauthorized parties.
- **System Integrity:** Systems perform their intended functions without unauthorized manipulation (e.g., no rootkits, no unauthorized firmware changes).
- Technologies that support integrity: hashing (MD5, SHA-256), digital signatures, file integrity monitoring (FIM).

### 1.2.3 Availability

**Availability** means ensuring that systems work promptly and that service is not denied to authorized users.

- Protection against DoS/DDoS attacks, hardware failures, and natural disasters.
- Technologies that support availability: redundancy, failover clusters, UPS/backup power, load balancers, disaster recovery plans.

> **Oral Exam Tip:** Be able to give a concrete example of a threat to each pillar. Confidentiality -- data breach / eavesdropping. Integrity -- man-in-the-middle attack altering data. Availability -- DDoS attack bringing down a web server.

---

## 1.3 Beyond CIA: Authentication, Accountability, and Non-Repudiation

### 1.3.1 Authentication (Verifying Identity and Origin)

- **User Authentication:** Verify users are who they claim to be (MFA, biometrics, certificates).
- **Message Authentication:** Confirm message origin and that the message has not been altered (HMAC, digital signatures).
- **Device Authentication:** Verify devices are legitimate (device certificates, TPM attestation).

### 1.3.2 Accountability (Tracing Actions to Entities)

- **Audit Logging:** Record who did what, when, and where (SIEM, event logs).
- **Forensic Investigation:** Trace security incidents back to the responsible party.
- **Deterrence:** Users act responsibly knowing their actions are tracked and attributable.

### 1.3.3 Non-Repudiation (Proving Actions Occurred)

- **Digital Signatures:** Cryptographic proof that a sender signed a document or message.
- **Legal Evidence:** Undeniable proof for contracts, transactions, and communications.
- **Blockchain and Timestamps:** Immutable record of when actions occurred.

> **Oral Exam Tip:** Non-repudiation is what prevents someone from denying they performed an action. The classic example is a digital signature on an email -- the sender cannot later claim they did not send it.

---

## 1.4 Core Security Concepts

### 1.4.1 Threat

A **threat** is a potential danger to assets (data, systems, networks) from malicious actors (APT groups, ransomware operators) or unintentional risks (misconfigurations, human error).

### 1.4.2 Vulnerability

A **vulnerability** is a weakness in software, hardware, configuration, or processes that can be exploited. The **attack surface** is the sum of all exploitable entry points (APIs, cloud services, IoT devices, supply chain components).

### 1.4.3 Exploit

An **exploit** is the mechanism used to leverage a vulnerability. It can be automated (exploit kits, botnets) or manual (targeted zero-day attacks). Examples: SQL injection, buffer overflow, phishing campaigns.

### 1.4.4 Risk

**Risk** is the likelihood that a threat exploits a vulnerability, resulting in damage.

**Risk = Likelihood x Impact**

Risk is managed through four strategies:

| Strategy | Description |
|----------|-------------|
| **Accept** | Acknowledge the risk and do nothing (cost of mitigation exceeds potential loss) |
| **Mitigate** | Implement controls to reduce likelihood or impact |
| **Transfer** | Shift the risk to a third party (e.g., cyber insurance) |
| **Avoid** | Eliminate the activity or asset that creates the risk |

> **Oral Exam Tip:** Be ready to define all four terms (threat, vulnerability, exploit, risk) in a single coherent chain: "A threat actor uses an exploit to take advantage of a vulnerability, and the probability of that happening combined with its impact is the risk."

---

## 1.5 Attack Vectors

An **attack vector** is the pathway an attacker uses to compromise a system.

### External Attack Vectors

| Vector | Examples |
|--------|----------|
| Phishing and Social Engineering | Spear-phishing, business email compromise (BEC), pretexting |
| Public-Facing Services | Exploiting web apps, APIs, VPNs, RDP services |
| Supply Chain Attacks | Compromised software updates, third-party libraries |
| Zero-Day Exploits | Unpatched vulnerabilities, CVEs in popular software |

### Internal Attack Vectors

| Vector | Examples |
|--------|----------|
| Insider Threats | Malicious or negligent employees, credential theft |
| Lateral Movement | Privilege escalation, use of stolen credentials |
| Cloud Misconfigurations | Weak IAM policies, insecure APIs |
| IoT/OT Compromise | Unsecured devices on corporate networks, legacy systems |

### Attack Classifications

| Passive Attacks | Active Attacks |
|-----------------|----------------|
| Observe without interfering | Modify or disrupt systems |
| Eavesdropping, traffic analysis | DoS, spoofing, MitM, password attacks |

### Attack Categories

| Reconnaissance | Access Attacks | DoS/DDoS |
|----------------|----------------|----------|
| Ping sweeps | Password attacks | Bandwidth floods |
| Port scanning | MitM attacks | Resource exhaustion |
| Vulnerability scans | Buffer overflow | Application layer |
| OSINT gathering | Privilege escalation | Amplification |
| Network mapping | Spoofing | Botnet attacks |

---

## 1.6 The Cyber Kill Chain

The **Cyber Kill Chain** was originally developed by **Lockheed Martin in 2011**. It describes the sequential stages of a cyber attack from reconnaissance to the final objective.

**Key principle:** Attackers must succeed at EVERY stage. Defenders only need to block ONE stage to prevent the attack. This asymmetry is the foundation of defense-in-depth.

### Phase 1: Reconnaissance

**Definition:** Information gathering and target analysis.

**Techniques:**
- OSINT tools (Shodan, Censys)
- Social media mining
- Automated scanning (Nmap)
- Dark web intelligence gathering
- GitHub/GitLab credential searches

**Defensive Measures:**
- Minimize digital footprint and exposure
- Deploy honeypots for reconnaissance detection
- Employee security awareness training
- Threat intelligence feeds
- Regular external attack surface assessments

### Phase 2: Weaponization

**Definition:** Creating or customizing the attack tool.

**Techniques:**
- Exploit kit usage
- Ransomware-as-a-Service (RaaS)
- Custom malware development
- Polymorphic and metamorphic code

**Defensive Measures:**
- Threat intelligence sharing (ISACs)
- Proactive vulnerability management
- Malware sample analysis (sandboxing)
- Indicators of Compromise (IoC) tracking
- Zero-day protection strategies

### Phase 3: Delivery

**Definition:** Transmitting the weapon to the target.

**Techniques:**
- Spear-phishing emails with attachments
- Watering hole attacks
- Supply chain compromises
- Compromised legitimate services (e.g., Dropbox)

**Defensive Measures:**
- Email security gateways (SEG)
- Web content filtering and DNS filtering
- Network segmentation and micro-segmentation
- User awareness training (phishing simulations)
- Application allowlisting

### Phase 4: Exploitation

**Definition:** Triggering the vulnerability on the target.

**Vulnerability Types:**
- Software vulnerabilities (CVEs, zero-days)
- Configuration weaknesses (default credentials, misconfigurations)
- Human vulnerabilities (social engineering)
- Authentication/authorization flaws

**Defensive Measures:**
- Aggressive patch management (hours/days, not weeks)
- Virtual patching (WAF, IPS)
- Endpoint protection (EDR/XDR)
- Principle of least privilege
- Input validation and secure coding practices

### Phase 5: Installation

**Definition:** Establishing persistence on the compromised system.

**Persistence Techniques:**
- Backdoors and Remote Access Tools
- Registry modifications (Run keys)
- Web shells on compromised servers
- Boot/startup modifications

**Defensive Measures:**
- Application allowlisting (block unauthorized executables)
- File Integrity Monitoring (FIM)
- EDR behavioral detection
- Privileged Access Management (PAM)
- Regular system audits and baselining

> **Oral Exam Tip:** Phase 5 is the CRITICAL DETECTION WINDOW. If attackers successfully install persistence, they can return even after the initial compromise is detected and remediated. This is often the last chance before attackers achieve full operational capability.

### Phase 6: Command and Control (C2)

**Definition:** Establishing two-way communication between the attacker and the compromised system.

**C2 Channels:**
- HTTPS (encrypted, looks like normal web traffic)
- DNS tunneling (covert data exfiltration)
- Social media APIs (Twitter, GitHub, Telegram)
- Cloud services (Dropbox, OneDrive, Pastebin)
- Domain Generation Algorithms (DGA)

**Defensive Measures:**
- Network traffic analysis and anomaly detection
- DNS monitoring and sinkholing
- Egress filtering (block outbound to suspicious IPs)
- TLS/SSL inspection
- Threat intelligence feeds (known C2 infrastructure)

### Phase 7: Actions on Objectives

**Definition:** The attacker achieves their final goal.

**Attacker Objectives:**
- Data exfiltration (intellectual property, PII, credentials)
- Ransomware deployment and extortion
- System destruction or sabotage
- Cryptocurrency mining
- Lateral movement to additional systems
- Long-term espionage

**Defensive Measures:**
- Data Loss Prevention (DLP)
- Network segmentation (limit lateral movement)
- Behavioral analytics (UEBA)
- Robust backup and disaster recovery
- Incident response plan and tabletop exercises

> **Oral Exam Tip:** Memorize the 7 phases in order: Reconnaissance, Weaponization, Delivery, Exploitation, Installation, C2, Actions on Objectives. A mnemonic: "Really Wicked Deliveries Exploit Installations, Commanding Actions."

---

## 1.7 Zero Trust Architecture

**Zero Trust** operates on the principle: **"Never trust, always verify."**

- Every access request is verified regardless of origin (inside or outside the network).
- Continuous authentication and authorization is required.
- The traditional network perimeter is considered obsolete because of cloud adoption, remote work, and mobile devices -- there is no longer a clear "inside" vs. "outside."

Essential technologies supporting Zero Trust:
- Multi-Factor Authentication (MFA)
- Endpoint Detection and Response (EDR)
- Security Information and Event Management (SIEM)
- Cloud Access Security Brokers (CASB)
- Identity and Access Management (IAM)

---

## 1.8 Defense-in-Depth

**Defense-in-Depth** uses multiple layers of security controls so that if one layer fails, others still protect the asset.

Core principles:
- **Layer controls across all stages** of the kill chain
- **Early detection:** the earlier you detect, the less damage is possible
- **Continuous monitoring:** 24/7 visibility into all phases
- **Assume breach:** plan for when prevention fails
- **Share intelligence:** benefit from community knowledge

In the context of network infrastructure, Defense-in-Depth typically involves three layers:

1. **Edge router** -- first and last line of defense
2. **Firewall** -- stateful inspection and filtering
3. **Internal router** -- connects to the protected LAN

A **DMZ (Demilitarized Zone)** can be placed between two routers for servers that must be accessible from the internet.

---

## 1.9 Edge Router Security

The **edge router** is the last router between the internal network and an untrusted network (such as the internet). All of an organization's internet traffic passes through it.

### Edge Router Security Approaches

| Approach | Description |
|----------|-------------|
| **Single Router** | One router connects the LAN to the internet; all security policies are on this device |
| **Defense-in-Depth** | Multiple layers: edge router, firewall, internal router |
| **DMZ** | Servers accessible from the internet are placed between two routers (external and internal) |

---

## 1.10 Router Hardening

Three areas of router security must be maintained:

### 1.10.1 Physical Security

- Place the router in a secure, locked room accessible only to authorized personnel.
- Install an uninterruptible power supply (UPS) or diesel backup power generator.

### 1.10.2 Operating System Security

- Configure the router with the maximum amount of memory possible (helps mitigate DoS attacks).
- Use the latest stable version of the operating system.
- Keep a secure backup copy of the OS image and configuration files.

### 1.10.3 Router Hardening (Configuration)

- Ensure only authorized personnel have access and their level of access is controlled.
- Disable unused ports and interfaces.
- Disable unnecessary services (many are enabled by default and can be used by attackers).

### Securing Administrative Access Checklist

- Restrict device accessibility
- Log and account for all access
- Authenticate access
- Authorize actions
- Present legal notification (banners)
- Ensure confidentiality of data (use SSH, not Telnet)

### Services to Disable or Restrict

| Service | Default State | Recommendation |
|---------|---------------|----------------|
| CDP | Enabled | Disable on edge devices |
| LLDP | Disabled | Keep disabled unless needed |
| PAD service | Enabled | Explicitly disable |
| TCP/UDP minor services | Enabled (IOS 11.3+) | Explicitly disable |
| MOP service | Enabled (Ethernet) | Explicitly disable |
| SNMP | Enabled | Disable when not required |
| HTTP/HTTPS server | Device dependent | Disable or restrict with ACLs |
| DNS | Enabled | Disable or explicitly set DNS server |
| ICMP redirects | Enabled | Disable when not required |
| IP source routing | Enabled | Disable |
| Finger service | Enabled | Disable |
| Proxy ARP | Enabled | Disable on each interface |
| Gratuitous ARP | Enabled | Disable on each interface |

> **Oral Exam Tip:** When asked about router hardening, structure your answer around the three areas (physical, OS, configuration) and then mention specific services to disable. The examiner will be impressed if you can name several default-enabled services that should be turned off on an edge router.

---

# 2. Secure Administrative Access

## 2.1 Password Types and Encryption

Cisco IOS uses several password types, each with a different level of security.

### 2.1.1 Password Type Overview

| Type | Algorithm | Security Level | Description |
|------|-----------|----------------|-------------|
| **Type 0** | Plaintext | **None** | Password stored in clear text in the configuration file. Visible to anyone with access to `show running-config`. |
| **Type 5** | MD5 hash | **Weak (legacy)** | Uses Message Digest 5. No longer considered secure -- attackers can reconstruct valid hashes. Default for `enable secret` if no algorithm is specified. |
| **Type 7** | Vigenere cipher | **Very Weak** | Used by `service password-encryption`. Easily reversible -- many free tools exist online to decode Type 7 passwords. Better than plaintext but NOT secure. |
| **Type 8** | PBKDF2 + SHA-256 | **Strong** | Password-Based Key Derivation Function 2 combined with SHA-256. Iteration-based, making brute-force slower. Introduced in IOS 15.3(3)M. |
| **Type 9** | scrypt | **Strongest** | Memory-intensive hash algorithm. Attackers cannot efficiently parallelize brute-force attempts because the algorithm requires significant memory, providing strong protection against ASIC and GPU-based attacks. Introduced in IOS 15.3(3)M. |

### 2.1.2 Algorithm Comparison

| Feature | MD5 (Type 5) | PBKDF2/SHA-256 (Type 8) | scrypt (Type 9) |
|---------|-------------|------------------------|-----------------|
| Brute-force resistance | Low | High (iteration-based) | Highest (memory-intensive + iteration-based) |
| GPU/ASIC resistance | None | Moderate | High |
| IOS version required | All | 15.3(3)M+ | 15.3(3)M+ |
| Algorithm keyword | `md5` | `sha256` | `scrypt` |
| Recommended | **No** | Yes | **Yes (preferred)** |

### 2.1.3 Configuring Secret Passwords with Algorithm Types

```cisco
! Type 9 (scrypt) -- RECOMMENDED
Router(config)# enable algorithm-type scrypt secret cisco12345

! Type 8 (PBKDF2/SHA-256)
Router(config)# enable algorithm-type sha256 secret cisco12345

! Type 5 (MD5) -- legacy, NOT recommended
Router(config)# enable secret cisco12345
```

For usernames:

```cisco
! Type 9 (scrypt)
Router(config)# username admin algorithm-type scrypt secret cisco12345

! Type 8 (PBKDF2/SHA-256)
Router(config)# username user01 algorithm-type sha256 secret user01pass
```

### Verification

```cisco
Router# show running-config | include secret
```

You will see the hashed password with the type prefix (e.g., `$9$` for scrypt, `$8$` for PBKDF2, `$1$` for MD5).

> **Oral Exam Tip:** Know the difference between Type 5, 7, 8, and 9. The key distinction to emphasize: Type 7 is NOT encryption -- it is a trivially reversible encoding. Type 9 (scrypt) is the strongest because it is both CPU-intensive AND memory-intensive, making it resistant to GPU and ASIC-based cracking.

---

## 2.2 Service Password-Encryption

The `service password-encryption` command encrypts all plaintext passwords currently in the configuration file using **Type 7** (Vigenere cipher).

```cisco
Router(config)# service password-encryption
```

**What it encrypts:** Console, AUX, VTY line passwords, and other passwords that would otherwise appear in clear text.

**What it does NOT encrypt:** Passwords already stored as `enable secret` (they use MD5/SHA-256/scrypt).

**Limitation:** Type 7 encryption is easily reversible. It only prevents casual "shoulder surfing" of the configuration file. It is NOT a substitute for strong hashing (Type 8 or 9).

### Verification

```cisco
Router# show running-config
```

Before `service password-encryption`:
```
line con 0
 password ciscoconpass
```

After `service password-encryption`:
```
line con 0
 password 7 094F471A1A0A464058
```

---

## 2.3 Minimum Password Length

```cisco
Router(config)# security passwords min-length 10
```

This command sets the minimum acceptable password length for all subsequently configured passwords. If a user tries to set a password shorter than the specified length, a warning message is displayed.

> **Oral Exam Tip:** This command does NOT retroactively change existing passwords. It only affects new passwords configured after the command is entered.

---

## 2.4 Login Block-For (Brute-Force Protection)

The `login block-for` command defends against brute-force password attacks by disabling logins after a specified number of failed attempts.

```cisco
Router(config)# login block-for 120 attempts 3 within 60
```

This means: **Block all login attempts for 120 seconds if 3 failed attempts occur within 60 seconds.**

### Two Operating Modes

| Mode | Also Called | Description |
|------|------------|-------------|
| **Normal mode** | Watch mode | Router counts failed login attempts within the configured time window |
| **Quiet mode** | Quiet period | All login attempts (Telnet, SSH, HTTP) are denied for the configured block period |

### Related Commands

```cisco
! Allow specific hosts even during quiet mode
Router(config)# login quiet-mode access-class {acl-name | acl-number}

! Add delay between failed login attempts
Router(config)# login delay 5

! Log successful and failed login attempts
Router(config)# login on-success log
Router(config)# login on-failure log

! Generate log when failure rate is exceeded
Router(config)# security authentication failure rate threshold-rate log
```

### Verification

```cisco
Router# show login
Router# show login failures
```

The `show login` command displays the `login block-for` settings and current mode (normal or quiet). The `show login failures` command shows IP addresses from which failed login attempts originated.

---

## 2.5 SSH Configuration

SSH encrypts all data transmitted over the network, replacing the insecure Telnet protocol. Below are all six steps to configure SSH on a Cisco device.

### Step 1: Configure a Unique Device Hostname

```cisco
Router(config)# hostname R1
```

### Step 2: Configure the IP Domain Name

```cisco
R1(config)# ip domain-name netsec.com
```

### Step 3: Generate RSA Encryption Key Pair

```cisco
! First, erase any existing key pairs
R1(config)# crypto key zeroize rsa

! Generate new RSA keys (1024 bits minimum recommended)
R1(config)# crypto key generate rsa general-keys modulus 1024
```

The key name will automatically be `hostname.domain-name` (e.g., `R1.netsec.com`).

### Step 4: Verify or Create a Local Database Entry

```cisco
R1(config)# username admin privilege 15 algorithm-type scrypt secret cisco12345
```

### Step 5: Authenticate Against the Local Database

```cisco
R1(config)# line vty 0 4
R1(config-line)# login local
```

### Step 6: Enable VTY Inbound SSH Sessions

```cisco
R1(config-line)# transport input ssh
R1(config-line)# exit
```

### Force SSH Version 2

```cisco
R1(config)# ip ssh version 2
```

### Configure SSH Timeouts and Authentication Parameters

```cisco
! Set authentication timeout (default is 120 seconds)
R1(config)# ip ssh time-out 90

! Set maximum authentication retries (default is 3)
R1(config)# ip ssh authentication-retries 2
```

### Verification Commands

```cisco
! View SSH configuration
R1# show ip ssh

! View active SSH connections
R1# show ssh

! View connected users
R1# show users
```

### Connecting to an SSH-Enabled Router

From another router:
```cisco
R2# ssh -l admin 10.1.1.1
```

From a host: Use PuTTY, OpenSSH, or TeraTerm with the SSH protocol selected.

> **Oral Exam Tip:** Be ready to list all 6 SSH configuration steps from memory. The examiner may ask you to walk through the complete configuration. Also know that if only `transport input ssh` is configured, Telnet connections will be rejected -- this is a security best practice.

---

## 2.6 Console, VTY, and AUX Line Security

### 2.6.1 Console Line (line console 0)

The console port provides local, physical access to the device.

```cisco
R1(config)# line console 0
R1(config-line)# password ciscoconpass
R1(config-line)# login                        ! Simple password authentication
R1(config-line)# exec-timeout 5 0             ! Log out after 5 min inactivity
R1(config-line)# logging synchronous          ! Prevent log messages from interrupting input
```

For enhanced security using local username database:

```cisco
R1(config)# line console 0
R1(config-line)# login local                  ! Require username + password
```

### 2.6.2 VTY Lines (line vty 0 4)

VTY lines handle remote access (Telnet/SSH).

```cisco
R1(config)# line vty 0 4
R1(config-line)# password ciscovtypass
R1(config-line)# login                        ! Simple password authentication
R1(config-line)# exec-timeout 5 0
R1(config-line)# transport input ssh          ! Allow only SSH (block Telnet)
```

For enhanced security:

```cisco
R1(config)# line vty 0 4
R1(config-line)# login local                  ! Require username + password
R1(config-line)# privilege level 15           ! Users go directly to priv EXEC
R1(config-line)# transport input ssh
```

### 2.6.3 AUX Port (line aux 0)

The auxiliary port provides remote access via a modem connection.

```cisco
R1(config)# line aux 0
R1(config-line)# password ciscoauxpass
R1(config-line)# exec-timeout 5 0
R1(config-line)# login
```

For enhanced security:

```cisco
R1(config)# line aux 0
R1(config-line)# login local
```

### Key Differences: `login` vs `login local`

| Command | Behavior |
|---------|----------|
| `login` | Prompts for a password only (the password configured on that line) |
| `login local` | Prompts for a username AND password (checked against the local database) |

> **Oral Exam Tip:** `login local` is always more secure than `login` because it requires both a username and a password, providing accountability (you know WHO logged in, not just that someone knew the password).

---

## 2.7 Password Recovery Procedure

If an administrator loses or forgets the enable password, the password recovery procedure allows resetting it. This requires **physical access** to the device (console port).

### Step-by-Step Password Recovery

| Step | Action | Details |
|------|--------|---------|
| 1 | Connect to the console port | Use a console cable from a PC to the router |
| 2 | Record the configuration register | Note the current value (usually `0x2102`) |
| 3 | Power cycle the router | Remove and reconnect the power cord |
| 4 | Issue the break sequence | Press the break key combination (e.g., Alt+B in Tera Term) to enter ROMMON mode |
| 5 | Change the configuration register | `confreg 0x2142` -- tells router to skip startup-config on next boot |
| 6 | Reboot the router | `reset` |
| 7 | Skip initial setup | Press Ctrl-C or type `no` when prompted for initial configuration dialog |
| 8 | Enter privileged EXEC mode | `Router> enable` (no password required since startup-config was skipped) |
| 9 | Copy startup-config to running-config | `Router# copy startup-config running-config` |
| 10 | Verify the configuration | Check that your original configuration is loaded |
| 11 | Change the enable secret password | `R1(config)# enable secret cisco` |
| 12 | Enable all interfaces | Interfaces come up in shutdown state after password recovery |
| 13 | Restore the configuration register | `R1(config)# config-register 0x2102` |
| 14 | Save the configuration | `R1# copy running-config startup-config` |

### ROMMON Commands Used

```
rommon 1 > confreg 0x2142
rommon 2 > reset
```

The value `0x2142` tells the router to **ignore the startup configuration** on boot. The normal value `0x2102` tells the router to load the startup configuration normally.

### Disabling Password Recovery

An administrator can prevent password recovery to mitigate the risk of physical attacks:

```cisco
Router(config)# no service password-recovery
```

**Warning:** This is a hidden command. When configured:
- The break sequence must be issued within 5 seconds after image decompression during boot.
- If confirmed, the **startup configuration is completely erased** and the router boots with factory defaults.
- If not confirmed, the router boots normally.

### Verification

```cisco
Router# show version
```

The output includes the current configuration register value (e.g., `Configuration register is 0x2102`).

> **Oral Exam Tip:** The key concept is the configuration register. `0x2102` = normal boot (load startup-config). `0x2142` = bypass startup-config. This is why physical security of routers is critical -- anyone with physical access can perform password recovery.

---

## 2.8 Banners

Banners display messages to users connecting to the device. They serve as **legal notifications** that protect the organization.

```cisco
R1(config)# banner motd $Unauthorized access strictly prohibited!$
```

The `$` character is the delimiter -- it marks the beginning and end of the banner text. Any character not appearing in the message can be used as a delimiter.

Banner types:

| Banner Type | Command | When Displayed |
|-------------|---------|----------------|
| MOTD | `banner motd` | Before login prompt, displayed to all connections |
| Login | `banner login` | After MOTD, before login prompt |
| Exec | `banner exec` | After successful login |

> **Oral Exam Tip:** Banners are not just cosmetic. They serve a critical legal function: without a banner warning against unauthorized access, it may be difficult to prosecute intruders in some jurisdictions.

---

# 3. Authentication, Authorization, and Accounting (AAA)

## 3.1 AAA Concepts

### 3.1.1 Authentication -- "Who are you?"

**Authentication** verifies the identity of a user, device, or entity before granting access. Users and administrators must prove their identity using:
- Username and password combinations
- Challenge and response questions
- Token cards
- Biometrics
- Certificates

Example: "I am user 'student' and I know the password to prove it."

### 3.1.2 Authorization -- "What are you allowed to do?"

**Authorization** determines which resources an authenticated user can access and which operations they are allowed to perform. Authorization happens AFTER authentication.

Example: "User 'student' can access host serverXYZ using SSH only."

### 3.1.3 Accounting -- "What did you do?"

**Accounting** records what the user does, including what is accessed, the amount of time resources are used, and any changes that were made. It provides an audit trail.

Example: "User 'student' accessed host serverXYZ using SSH for 15 minutes."

Types of accounting information:
- **Network accounting** -- tracks network service usage (e.g., PPP)
- **Connection accounting** -- tracks outbound connections (SSH, Telnet)
- **EXEC accounting** -- tracks user EXEC shell sessions
- **System accounting** -- tracks system-level events
- **Command accounting** -- tracks which commands are executed

> **Oral Exam Tip:** Memorize the one-sentence definition of each "A" and be ready to provide an example. Authentication = identity verification. Authorization = permission control. Accounting = action logging.

---

## 3.2 Authentication Without AAA

The simplest method is configuring a login password on console, VTY, and AUX lines:

```cisco
R1(config)# line vty 0 4
R1(config-line)# password ciscovtypass
R1(config-line)# login
```

**Limitations:**
- No accountability -- anyone with the password can gain entry.
- Only a single shared password per line.
- SSH improves this by requiring a username and password, but user accounts must be configured locally on each device -- this does not scale.

---

## 3.3 Local vs. Server-Based AAA

### 3.3.1 Local AAA Authentication

Uses the **local router database** for authentication. Also called "self-contained authentication."

**Advantages:**
- No external server required.
- Works when the network is down.
- Suitable for small networks.

**Disadvantages:**
- User accounts must be configured on EVERY device individually.
- Does not scale for large networks.
- No centralized management.

### 3.3.2 Server-Based AAA Authentication

Uses a **central AAA server** (e.g., Cisco ISE, FreeRADIUS, Windows NPS) for authentication. The router communicates with the server using RADIUS or TACACS+ protocols.

**Advantages:**
- Centralized user management.
- Scales to large enterprise networks.
- Can integrate with external databases (Active Directory, LDAP).
- Multiple servers for redundancy.

**Disadvantages:**
- Requires network connectivity to the AAA server.
- Additional infrastructure (server) required.
- Must configure fallback methods in case the server is unreachable.

> **Oral Exam Tip:** The key scalability argument: with 100 routers and 50 users, local AAA requires configuring 50 accounts on each of the 100 routers (5,000 entries). With server-based AAA, you configure 50 accounts once on the central server.

---

## 3.4 Local AAA Configuration (Full CLI)

### Step 1: Add Usernames to the Local Database

```cisco
R1(config)# username Admin01 privilege 15 algorithm-type scrypt secret Admin01pass
R1(config)# username user01 algorithm-type sha256 secret user01pass
```

### Step 2: Enable AAA Globally

```cisco
R1(config)# aaa new-model
```

**Warning:** Once `aaa new-model` is entered, the router immediately begins using AAA for authentication. If you have not configured a default authentication list, you could get locked out. Always have a console session open when enabling AAA.

### Step 3: Configure the Default Authentication Method List

```cisco
R1(config)# aaa authentication login default local none
```

This means: First try the **local** database. If no usernames are configured in the local database, allow access with **no authentication** (fallback).

Using case-sensitive usernames:

```cisco
R1(config)# aaa authentication login default local-case none
```

### Step 4: (Optional) Create a Named Authentication Method List

```cisco
R1(config)# aaa authentication login SSH_LINES local
```

Apply the named list to VTY lines:

```cisco
R1(config)# line vty 0 4
R1(config-line)# login authentication SSH_LINES
```

### Step 5: Fine-Tune Authentication

Lock out accounts after excessive failed attempts:

```cisco
R1(config)# aaa local authentication attempts max-fail 5
```

Clear locked accounts:

```cisco
R1# clear aaa local user lockout
```

### Verification Commands

```cisco
R1# show aaa user
R1# show aaa sessions
R1# show running-config | section aaa
```

---

## 3.5 RADIUS vs. TACACS+ Comparison

| Feature | TACACS+ | RADIUS |
|---------|---------|--------|
| **Standard** | Mostly Cisco proprietary | Open standard (RFC 2865/2866) |
| **Transport Protocol** | **TCP** (port 49) | **UDP** (ports 1812/1813 or 1645/1646) |
| **AAA Separation** | **Separates** authentication, authorization, and accounting | **Combines** authentication and authorization; separates accounting |
| **Encryption** | **Entire packet** encrypted | **Only password** encrypted; rest of packet in plaintext |
| **Protocol Support** | Bidirectional CHAP | Unidirectional CHAP (server to client) |
| **Command Authorization** | **Yes** -- can authorize router commands per-user or per-group | **No** -- cannot authorize individual router commands |
| **Accounting** | Limited | **Extensive** |
| **Best Use Case** | Device administration (router/switch management) | Network access (Wi-Fi, VPN, 802.1X) |
| **Flexibility** | More flexible (modular AAA) | Less flexible (combined auth+authz) |

> **Oral Exam Tip:** The two most important differences to remember: (1) TACACS+ encrypts the ENTIRE packet while RADIUS only encrypts the password. (2) TACACS+ separates all three A's while RADIUS combines authentication and authorization. For device administration, TACACS+ is preferred; for network access, RADIUS is more common.

---

## 3.6 RADIUS Server Configuration (Full CLI)

### Step 1: Enable AAA Globally

```cisco
R1(config)# aaa new-model
```

### Step 2: Define the RADIUS Server

```cisco
R1(config)# radius server NetSec
R1(config-radius-server)# address ipv4 192.168.1.11 auth-port 1812 acct-port 1813
R1(config-radius-server)# key $trongPass
R1(config-radius-server)# exit
```

**Important:** The default Cisco IOS RADIUS ports are **1645/1646**. RFC 2865 officially assigned ports **1812/1813**. You must ensure the router and server use matching port numbers. If they differ, use the `auth-port` and `acct-port` options.

### Step 3: Configure the Authentication Method List

Using RADIUS as the primary method with `none` as fallback:

```cisco
R1(config)# aaa authentication login default group radius none
```

Using RADIUS as primary with local database as fallback:

```cisco
R1(config)# aaa authentication login default group radius local
```

### Step 4: (Optional) Create a Named Method List for SSH

```cisco
R1(config)# aaa authentication login SSH_LINES group radius
R1(config)# line vty 0 4
R1(config-line)# login authentication SSH_LINES
```

### TACACS+ Server Configuration (for comparison)

```cisco
R1(config)# tacacs server TACACS_SVR
R1(config-server-tacacs)# address ipv4 192.168.1.20
R1(config-server-tacacs)# single-connection
R1(config-server-tacacs)# key MyTacacsKey
R1(config-server-tacacs)# exit

R1(config)# aaa authentication login default group tacacs+ local
```

The `single-connection` command enhances TCP performance by maintaining a persistent TCP session rather than creating a new one for each request.

### Testing RADIUS Configuration

```cisco
R1# test aaa group radius RadUser RadUserpass legacy
```

Successful output: `User was successfully authenticated.`

### Verification Commands

```cisco
R1# show radius server-group radius
R1# show aaa sessions
R1# show running-config | section radius
R1# show running-config | section aaa
```

> **Oral Exam Tip:** Be able to walk through the complete RADIUS configuration from memory: (1) `aaa new-model`, (2) `radius server NAME`, (3) `address ipv4` with ports, (4) `key`, (5) `aaa authentication login default group radius local`. Always include a fallback method (`local` or `none`) so you do not get locked out.

---

## 3.7 Method Lists: Default vs. Named

A **method list** defines the sequence of authentication methods to be tried. The router tries the first method; if it is unavailable (server unreachable), it tries the next one.

### Default Method List

- Applied automatically to **all lines and interfaces** unless overridden.
- Configured with the keyword `default`.

```cisco
R1(config)# aaa authentication login default local none
```

### Named Method List

- Applied only to the lines where it is explicitly assigned.
- Overrides the default method list for that specific line.
- Identified by a custom name (e.g., `SSH_LINES`).

```cisco
R1(config)# aaa authentication login SSH_LINES group radius
R1(config)# line vty 0 4
R1(config-line)# login authentication SSH_LINES
```

### Method Keywords

| Method Keyword | Description |
|----------------|-------------|
| `enable` | Uses the enable password for authentication |
| `local` | Uses the local username database (case-insensitive) |
| `local-case` | Uses the local username database (case-sensitive) |
| `none` | No authentication (allows access without credentials) |
| `group radius` | Uses all configured RADIUS servers |
| `group tacacs+` | Uses all configured TACACS+ servers |
| `group group-name` | Uses a specific subset of RADIUS or TACACS+ servers |

**Fallback behavior:** Methods are tried in order. The router moves to the next method ONLY if the previous method is **unavailable** (server unreachable), NOT if authentication fails (wrong password). If a user provides a wrong password to a RADIUS server, the RADIUS server returns "authentication failed" and the router does NOT fall back to the next method.

> **Oral Exam Tip:** This fallback distinction is critical. If a RADIUS server is reachable and rejects a user, the router does NOT try the local database. It only falls back when the server itself cannot be reached. The only exception is the `none` method, which always permits access.

---

## 3.8 Privilege Levels (0-15)

Cisco IOS provides 16 privilege levels (0 through 15) to control which commands a user can execute.

### Default Privilege Levels

| Level | Access | Default Commands |
|-------|--------|-----------------|
| **0** | Minimal | `logout`, `enable`, `disable`, `help`, `exit` |
| **1** | User EXEC | Basic monitoring commands (e.g., `show version`, `ping`) |
| **2-14** | Custom | No commands assigned by default -- administrator defines them |
| **15** | Privileged EXEC | Full access to all commands including `configure terminal` |

### Configuring Custom Privilege Levels

Assign specific commands to a privilege level:

```cisco
R1(config)# privilege exec level 5 show running-config
R1(config)# privilege exec level 5 show ip route
```

### Assigning Passwords to Privilege Levels

Method 1 -- Assign a privilege level to a user:

```cisco
R1(config)# username admin privilege 15 secret cisco12345
R1(config)# username helpdesk privilege 5 secret helppass
```

Method 2 -- Assign a password to a privilege level:

```cisco
R1(config)# enable secret level 5 helppass
```

### Limitations of Privilege Levels

- No access control to specific interfaces, ports, or logical interfaces.
- Commands at lower privilege levels are always executable at higher levels.
- Commands set at a higher privilege level are NOT available to lower-privileged users.
- Assigning a command with multiple keywords grants access to ALL commands using those keywords. For example, allowing `show ip route` also allows access to all `show` and `show ip` commands.

### Verification

```cisco
R1# show privilege
```

> **Oral Exam Tip:** The major weakness of privilege levels is the keyword inheritance problem. If you grant level 5 access to `show ip route`, the user also gets access to ALL `show` commands and ALL `show ip` commands. Parser views (RBAC) solve this problem.

---

## 3.9 Parser Views / Role-Based CLI Access (RBAC)

Parser views provide **finer, more granular access control** than privilege levels. They allow administrators to define exactly which commands are available to specific roles, without the keyword inheritance problem.

### Three Types of Views

| View Type | Description |
|-----------|-------------|
| **Root View** | Equivalent to privilege level 15. Required to create and manage all other views. |
| **CLI View** | A set of specific commands bundled together for a particular role. |
| **Superview** | A container for one or more CLI views. Users logged into a superview can access all commands from all included CLI views. |

### Superview Characteristics

- A single CLI view can be shared across multiple superviews.
- Commands cannot be configured directly for a superview -- they must be added to a CLI view first, then that view is added to the superview.
- Each superview has its own password for switching between views.
- Deleting a superview does NOT delete the associated CLI views.

### Configuring CLI Views (5 Steps)

**Step 1: Enable AAA and enter root view**

```cisco
R1(config)# aaa new-model
R1(config)# exit
R1# enable view
Password: cisco12345
```

**Step 2: Create the view**

```cisco
R1(config)# parser view admin1
```

**Step 3: Assign a secret password to the view**

```cisco
R1(config-view)# secret admin1pass
```

**Step 4: Assign commands to the view**

```cisco
R1(config-view)# commands exec include all show
R1(config-view)# commands exec include all config terminal
R1(config-view)# commands exec include all debug
```

**Step 5: Exit view configuration mode**

```cisco
R1(config-view)# exit
```

### Command Assignment Options

| Option | Description |
|--------|-------------|
| `include` | Adds a command to the view; the same command can be added to other views |
| `include-exclusive` | Adds a command to the view and EXCLUDES it from being added to any other view |
| `exclude` | Removes/blocks a command from the view |
| `all` | Wildcard -- includes all subcommands under the specified keyword |

### Example: Creating Multiple Views with Different Privileges

**admin1 view (full access):**

```cisco
R1(config)# parser view admin1
R1(config-view)# secret admin1pass
R1(config-view)# commands exec include all show
R1(config-view)# commands exec include all config terminal
R1(config-view)# commands exec include all debug
R1(config-view)# exit
```

**admin2 view (read-only):**

```cisco
R1(config)# parser view admin2
R1(config-view)# secret admin2pass
R1(config-view)# commands exec include all show
R1(config-view)# exit
```

**tech view (limited show commands only):**

```cisco
R1(config)# parser view tech
R1(config-view)# secret techpasswd
R1(config-view)# commands exec include show version
R1(config-view)# commands exec include show interfaces
R1(config-view)# commands exec include show ip interface brief
R1(config-view)# commands exec include show parser view
R1(config-view)# exit
```

### Configuring Superviews

**Step 1: Create the superview**

```cisco
R1(config)# parser view USER superview
```

**Step 2: Assign a secret password**

```cisco
R1(config-view)# secret userpass
```

**Step 3: Add CLI views to the superview**

```cisco
R1(config-view)# view admin2
R1(config-view)# view tech
```

**Step 4: Exit**

```cisco
R1(config-view)# exit
```

### Verification Commands

```cisco
! Switch to a specific view
R1# enable view admin1
Password: admin1pass

! Check current view
R1# show parser view

! List all configured views (from root view)
R1# show parser view all

! See available commands in the current view
R1# ?
R1# show ?
```

### Deleting a View

```cisco
R1(config)# no parser view admin2
```

> **Oral Exam Tip:** Parser views require AAA to be enabled (`aaa new-model`) -- this is a prerequisite. You must be in root view to create or modify any view. The difference between privilege levels and parser views is that parser views give exact command-level control without the keyword inheritance problem.

---

## 3.10 AAA Authorization Configuration

Authorization controls what authenticated users can do.

```cisco
R1(config)# aaa authorization exec default group tacacs+ local
R1(config)# aaa authorization commands 15 default group tacacs+ local
R1(config)# aaa authorization network default group radius
```

### Authorization Types

| Type | Description |
|------|-------------|
| `network` | For network services such as PPP and SLIP |
| `exec` | For User EXEC terminal sessions |
| `commands level` | Authorizes all EXEC mode commands at the specified privilege level |

**Note:** TACACS+ supports per-command authorization. RADIUS does NOT support individual router command authorization.

---

## 3.11 AAA Accounting Configuration

Accounting tracks user activity and sends records to the AAA server.

```cisco
R1(config)# aaa accounting exec default start-stop group tacacs+
R1(config)# aaa accounting network default start-stop group radius
R1(config)# aaa accounting connection default start-stop group tacacs+
```

### Accounting Types

| Type | Description |
|------|-------------|
| `network` | All network-related service requests (e.g., PPP) |
| `exec` | EXEC shell sessions |
| `connection` | All outbound connections (SSH, Telnet) |

### Accounting Triggers (Record Types)

| Trigger | Description |
|---------|-------------|
| `start-stop` | Sends a "start" notice at the beginning AND a "stop" notice at the end of a process |
| `stop-only` | Sends a "stop" record for all cases, including authentication failures |
| `none` | Disables accounting on a line or interface |

---

## 3.12 Debug Commands for AAA

Debug commands are essential for troubleshooting AAA configurations.

### Enable AAA Authentication Debugging

```cisco
R1# debug aaa authentication
```

### What the Debug Output Shows

**Successful authentication:**
```
AAA/AUTHEN/LOGIN (00000FB5): Pick method list 'SSH_LINES'
%SEC_LOGIN-5-LOGIN_SUCCESS: Login Success [user: Admin01] [Source: 10.2.2.2] [localport: 22]
AAA/AUTHEN (402765494): status = PASS
```

**Failed authentication:**
```
AAA/AUTHEN(1943266075): password incorrect
AAA/AUTHEN (1943266075): status = FAIL
```

Key fields in debug output:
- **port** -- the terminal line (e.g., `tty866` for SSH)
- **rem_addr** -- the remote IP address of the connecting client
- **Method** -- which authentication method was used (e.g., `ENABLE`, `LOCAL`)
- **status** -- `PASS`, `FAIL`, or `GETPASS` (waiting for password)

### Disable Debugging

```cisco
R1# undebug all
```

### Configure Debug Timestamps

```cisco
R1(config)# service timestamps debug datetime msec
```

> **Oral Exam Tip:** The `debug aaa authentication` command is the go-to tool for troubleshooting AAA issues. Look for the `status` field: `PASS` = success, `FAIL` = wrong credentials, `GETPASS` = waiting for password input. Also check which method list is being picked -- this confirms whether the default or a named list is in use.

---

## 3.13 Cisco Identity Services Engine (ISE)

**Cisco ISE** is an identity and access control policy platform for enterprise environments. Key features:

- **Asset Visibility** -- discover and profile all devices on the network
- **Posture Assessment** -- check device compliance before granting access
- **Segmentation** -- enforce network segmentation policies
- **Guest Management** -- secure wireless guest access
- **Threat Containment** -- integrate with other security tools to contain threats

ISE replaces the older Cisco Secure ACS (Access Control System).

---

## Quick Reference: Essential Show Commands Summary

| Command | Purpose |
|---------|---------|
| `show running-config` | Display current configuration (including passwords) |
| `show running-config \| section aaa` | Display AAA configuration |
| `show running-config \| include secret` | Display hashed passwords |
| `show ip ssh` | Display SSH version, timeout, and retries |
| `show ssh` | Display active SSH sessions |
| `show users` | Display connected users |
| `show login` | Display login block-for settings and current mode |
| `show login failures` | Display failed login attempts with source IPs |
| `show privilege` | Display current privilege level |
| `show parser view` | Display current active view |
| `show parser view all` | Display all configured views (root view only) |
| `show aaa user` | Display AAA session attributes |
| `show aaa sessions` | Display active AAA sessions |
| `show radius server-group radius` | Display RADIUS server group info and port numbers |
| `show version` | Display IOS version and configuration register |
| `show secure bootset` | Verify Cisco IOS resilience archive |

---

## Quick Reference: Complete Configuration Template

The following template combines all security configurations from Sections 1-3 into a single reference:

```cisco
! === HOSTNAME AND DOMAIN ===
hostname R1
ip domain-name netsec.com
no ip domain-lookup

! === PASSWORDS AND USER ACCOUNTS ===
enable algorithm-type scrypt secret cisco12345
security passwords min-length 10
service password-encryption
username admin privilege 15 algorithm-type scrypt secret cisco12345
username user01 algorithm-type sha256 secret user01pass

! === AAA CONFIGURATION ===
aaa new-model
aaa authentication login default local none
aaa authentication login SSH_LINES group radius local
aaa authorization exec default group tacacs+ local
aaa accounting exec default start-stop group tacacs+

! === RADIUS SERVER ===
radius server NetSec
 address ipv4 192.168.1.11 auth-port 1812 acct-port 1813
 key $trongPass

! === TACACS+ SERVER ===
tacacs server TACACS_SVR
 address ipv4 192.168.1.20
 single-connection
 key MyTacacsKey

! === SSH CONFIGURATION ===
crypto key generate rsa general-keys modulus 1024
ip ssh version 2
ip ssh time-out 90
ip ssh authentication-retries 2

! === CONSOLE LINE ===
line console 0
 login local
 exec-timeout 5 0
 logging synchronous

! === AUX LINE ===
line aux 0
 login local
 exec-timeout 5 0

! === VTY LINES ===
line vty 0 4
 login authentication SSH_LINES
 privilege level 15
 transport input ssh
 exec-timeout 5 0

! === BRUTE-FORCE PROTECTION ===
login block-for 120 attempts 3 within 60
login on-success log
login on-failure log

! === BANNER ===
banner motd $Unauthorized access strictly prohibited!$
```

> **Oral Exam Tip:** You do not need to memorize this entire template, but you should be able to reconstruct the logical flow: (1) basic settings, (2) passwords and users, (3) enable AAA, (4) define servers, (5) create method lists, (6) apply to lines, (7) configure SSH, (8) harden with brute-force protection and banners. Walk the examiner through this flow and they will see you understand the complete picture.


---

# 4. Access Control Lists (ACLs)

## 4.1 What Are ACLs and Why Are They Used?

An **Access Control List (ACL)** is a sequential list of permit or deny statements, known as **Access Control Entries (ACEs)**, that control whether a router forwards or drops packets based on information found in the packet header.

**Packet filtering** (sometimes called **static packet filtering**) controls access to a network by analyzing incoming and outgoing packets and passing or dropping them based on criteria such as:
- Source IP address
- Destination IP address
- Protocol carried within the packet
- Source and destination port numbers

### Why ACLs Are Used

- **Security**: Limit network traffic to increase network performance and enforce security policies
- **Traffic filtering**: Block specific traffic types (e.g., deny Telnet access, permit only HTTP)
- **Access control**: Restrict which networks or hosts can reach certain resources
- **VTY line protection**: Control who can SSH/Telnet into the router itself
- **Route filtering**: Control which routes are advertised or received in routing protocols
- **NAT**: Identify traffic for Network Address Translation
- **QoS**: Classify traffic for quality of service

> **Oral Exam Tip:** Be ready to explain that ACLs are not just for security -- they are also used for NAT, QoS, route filtering, and VTY access control. Always mention that an ACL is a *sequential* list processed top-down.

---

## 4.2 Standard vs. Extended ACLs

### Standard ACLs

- Filter traffic based on the **source IP address only**
- Cannot filter by destination address, protocol, or port number
- **Numbered range**: 1-99 and 1300-1999
- Should be placed **as close to the destination as possible** (because they cannot distinguish destination -- placing them near the source would block traffic to ALL destinations, not just the intended one)

### Extended ACLs

- Filter traffic based on **source IP, destination IP, protocol, source port, and destination port**
- Can match on TCP flags, ICMP types, and more
- **Numbered range**: 100-199 and 2000-2699
- Should be placed **as close to the source as possible** (because they are specific enough to filter precisely -- placing them near the source prevents unwanted traffic from consuming bandwidth across the network)

> **Oral Exam Tip:** When asked about placement, always explain *why*: Standard ACLs go near the destination because they only see source addresses -- placing them near the source would accidentally block legitimate traffic to other destinations. Extended ACLs go near the source because they can be precise enough to only block the intended traffic, saving bandwidth on intermediate links.

### Comparison Table

| Feature | Standard ACL | Extended ACL |
|---|---|---|
| Filters on | Source IP only | Source IP, Dest IP, Protocol, Ports |
| Numbered range | 1-99, 1300-1999 | 100-199, 2000-2699 |
| Placement | Near destination | Near source |
| Granularity | Low | High |
| Performance impact | Lower (fewer checks) | Higher (more checks) |

---

## 4.3 Numbered vs. Named ACLs

### Numbered ACLs

- Identified by a number (e.g., `access-list 1`, `access-list 100`)
- The number determines whether it is standard or extended
- Cannot delete individual lines (in older IOS -- modern IOS allows editing via sequence numbers)
- Less descriptive

### Named ACLs

- Identified by a descriptive alphanumeric name (e.g., `BRANCH-OFFICE-POLICY`)
- Can be either standard or extended
- Individual statements can be added or deleted without removing the entire ACL
- More descriptive and self-documenting
- Recommended best practice

```cisco
! Named standard ACL
R1(config)# ip access-list standard BLOCK-HOST
R1(config-std-nacl)# deny host 192.168.10.10
R1(config-std-nacl)# permit any

! Named extended ACL
R1(config)# ip access-list extended WEB-ONLY
R1(config-ext-nacl)# permit tcp any any eq 80
R1(config-ext-nacl)# permit tcp any any eq 443
R1(config-ext-nacl)# deny ip any any
```

> **Oral Exam Tip:** Named ACLs are preferred in production because they are self-documenting, easier to edit (you can add or remove individual lines), and not limited by number ranges.

---

## 4.4 Wildcard Masks

A **wildcard mask** is a 32-bit value that tells the router which bits of an IP address to examine (match) and which to ignore.

- **Wildcard mask bit 0**: Match the corresponding bit in the address (must be exact)
- **Wildcard mask bit 1**: Ignore the corresponding bit in the address (can be anything)

Wildcard masks are often called **inverse masks** because they are the opposite of subnet masks.

### Calculating a Wildcard Mask

Subtract the subnet mask from 255.255.255.255:

```
Subnet mask:   255.255.255.0
Wildcard mask: 255.255.255.255 - 255.255.255.0 = 0.0.0.255
```

### Examples

| Network | Subnet Mask | Wildcard Mask | Meaning |
|---|---|---|---|
| 192.168.10.0/24 | 255.255.255.0 | 0.0.0.255 | Match any host in 192.168.10.x |
| 192.168.0.0/16 | 255.255.0.0 | 0.0.255.255 | Match any host in 192.168.x.x |
| 10.0.0.0/8 | 255.0.0.0 | 0.255.255.255 | Match any host in 10.x.x.x |
| 192.168.1.0/30 | 255.255.255.252 | 0.0.0.3 | Match 4 addresses (192.168.1.0-3) |
| 192.168.10.10/32 | 255.255.255.255 | 0.0.0.0 | Match exactly one host |

### Wildcard Mask Keywords

- **`host`** = wildcard mask 0.0.0.0 (match exactly one address)
- **`any`** = wildcard mask 255.255.255.255 (match all addresses)

> **Oral Exam Tip:** Be able to calculate wildcard masks quickly. The trick: subtract the subnet mask from 255.255.255.255. Know the keywords `host` (0.0.0.0) and `any` (255.255.255.255) and what they mean.

---

## 4.5 ACL Processing Order

ACLs are processed **top-down, first-match**:

1. The router compares the packet against the **first** ACE in the list
2. If it matches, the action (permit or deny) is taken immediately -- no further ACEs are checked
3. If it does not match, the router moves to the **next** ACE
4. This continues until a match is found or the end of the list is reached
5. If no ACE matches, the packet is dropped by the **implicit deny** at the end

### The Implicit Deny

Every ACL has an invisible `deny any` (IPv4) or `deny ipv6 any any` (IPv6) statement at the end. This means:

- An ACL with **no permit statements** blocks ALL traffic
- You must have **at least one permit** statement, or the ACL will deny everything
- The implicit deny does not appear in the configuration, but it is always active

### Order of ACEs Matters

```cisco
! WRONG ORDER -- the deny is never reached because "permit any" matches first
access-list 1 permit any
access-list 1 deny host 192.168.10.10

! CORRECT ORDER -- specific deny first, then general permit
access-list 1 deny host 192.168.10.10
access-list 1 permit any
```

**Best practice**: Place the most specific entries at the top and the most general entries at the bottom.

> **Oral Exam Tip:** The examiner may present you with an ACL and ask what happens to a specific packet. Walk through each line top-down and stop at the first match. If nothing matches, say "implicit deny -- the packet is dropped."

---

## 4.6 The Three Ps

The **Three Ps** rule defines ACL application limits:

- **One ACL per Protocol** -- one for IPv4, one for IPv6
- **One ACL per Direction** -- separate ACLs for inbound and outbound
- **One ACL per Interface** -- each ACL controls traffic for one interface

In summary: you can have at most **one ACL per interface, per direction, per protocol**.

---

## 4.7 ACL Placement Rules

### Standard ACLs -- Place Near the Destination

Standard ACLs only examine the **source address**. If placed near the source, they would block traffic from that source to ALL destinations, not just the intended one.

### Extended ACLs -- Place Near the Source

Extended ACLs can match on source, destination, protocol, and ports. Because they are precise enough to block only the exact traffic desired, placing them near the source prevents unwanted traffic from traversing the network.

> **Oral Exam Tip:** The placement question is a classic exam topic. Always explain the reasoning: standard ACLs lack destination information, so they must go near the destination to avoid collateral blocking. Extended ACLs have full information, so they go near the source to save bandwidth.

---

## 4.8 Inbound vs. Outbound ACL Logic

### Inbound ACL Processing

1. Packet arrives at the interface
2. Router checks if an **inbound** ACL exists on the interface
3. If yes, the packet is tested against the ACL
4. If permitted, the packet is sent to the routing process
5. If denied (or no match -- implicit deny), the packet is dropped

### Outbound ACL Processing

1. The router receives the packet and checks the routing table for the exit interface
2. If no route exists, the packet is dropped (regardless of ACL)
3. The router checks if an **outbound** ACL exists on the exit interface
4. If yes, the packet is tested against the ACL
5. If permitted, the packet is forwarded out the interface
6. If denied (or no match -- implicit deny), the packet is dropped

**Key difference**: Inbound ACLs are checked **before** routing; outbound ACLs are checked **after** routing.

---

## 4.9 Configuring Standard IPv4 ACLs

### Numbered Standard ACL Syntax

```cisco
Router(config)# access-list {1-99 | 1300-1999} {deny | permit | remark}
                source [source-wildcard] [log]
```

### Example: Numbered Standard ACL

```cisco
R3(config)# access-list 1 deny host 192.168.10.10
R3(config)# access-list 1 permit 192.168.10.0 0.0.0.255
R3(config)# access-list 1 deny 192.168.0.0 0.0.255.255
R3(config)# access-list 1 permit 192.0.0.0 0.255.255.255
! (Implicit deny any is at the end)
```

### Apply to Interface

```cisco
R3(config)# interface GigabitEthernet0/1
R3(config-if)# ip access-group 1 out
```

### Named Standard ACL

```cisco
R1(config)# ip access-list standard BRANCH-OFFICE-POLICY
R1(config-std-nacl)# permit host 192.168.30.3
R1(config-std-nacl)# permit 192.168.40.0 0.0.0.255
R1(config-std-nacl)# deny any

R1(config)# interface GigabitEthernet0/1
R1(config-if)# ip access-group BRANCH-OFFICE-POLICY out
```

### Securing VTY Lines with Standard ACLs

```cisco
R1(config)# access-list 5 permit host 192.168.1.3

R1(config)# line vty 0 4
R1(config-line)# access-class 5 in
R1(config-line)# transport input ssh
```

> **Oral Exam Tip:** For VTY lines, use `access-class` (not `access-group`). This is a very common exam question.

### Removing ACLs

```cisco
R3(config)# interface GigabitEthernet0/1
R3(config-if)# no ip access-group 1 out

R3(config)# no access-list 1
```

---

## 4.10 Configuring Extended IPv4 ACLs

### Numbered Extended ACL Syntax

```cisco
Router(config)# access-list {100-199 | 2000-2699} {deny | permit | remark}
                protocol source source-wildcard [operator port]
                destination dest-wildcard [operator port]
                [established] [log]
```

**Operators**: `eq` (equal), `gt` (greater than), `lt` (less than), `neq` (not equal), `range`

### Example: Numbered Extended ACL

```cisco
R1(config)# access-list 101 permit tcp any host 192.168.4.1 eq 80
R1(config)# access-list 101 permit tcp any host 192.168.4.1 eq 443
R1(config)# access-list 101 deny ip 192.168.1.0 0.0.0.255 any
R1(config)# access-list 101 deny ip 127.0.0.0 0.255.255.255 any
R1(config)# access-list 101 deny ip 224.0.0.0 31.255.255.255 any
R1(config)# access-list 101 permit ip any any
```

### Controlling Return Traffic with `established`

```cisco
R1(config)# access-list 102 permit tcp any any established
R1(config)# access-list 102 permit icmp any any echo-reply
R1(config)# access-list 102 permit icmp any any unreachable
```

### Named Extended ACL

```cisco
R1(config)# ip access-list extended SALES-RESTRICTIONS
R1(config-ext-nacl)# deny tcp 10.40.0.0 0.0.0.255 10.20.0.0 0.0.0.255 eq 22
R1(config-ext-nacl)# deny tcp 10.40.0.0 0.0.0.255 10.20.0.0 0.0.0.255 eq 80
R1(config-ext-nacl)# deny tcp 10.40.0.0 0.0.0.255 10.20.0.0 0.0.0.255 eq 443
R1(config-ext-nacl)# deny icmp 10.40.0.0 0.0.0.255 10.30.0.0 0.0.0.255 echo
R1(config-ext-nacl)# permit ip any any
```

### Apply Extended ACL to Interface

```cisco
R1(config)# interface GigabitEthernet0/0/1.40
R1(config-subif)# ip access-group SALES-RESTRICTIONS in
```

> **Oral Exam Tip:** In an extended ACL, always remember the order of fields: `protocol source source-wildcard destination dest-wildcard`. The port number comes after the address it belongs to.

---

## 4.11 Configuring IPv6 ACLs

### Key Differences from IPv4 ACLs

| Feature | IPv4 ACLs | IPv6 ACLs |
|---|---|---|
| Types | Standard and Extended | Extended and Named only (no standard, no numbered) |
| Wildcard masks | Used for address matching | **Not used** -- prefix-length is used instead |
| Apply command | `ip access-group` | `ipv6 traffic-filter` |
| VTY apply command | `access-class` | `ipv6 access-class` |
| Additional defaults | Implicit deny only | Implicit deny PLUS `permit icmp any any nd-na` and `permit icmp any any nd-ns` |

The additional default statements for IPv6 allow **Neighbor Discovery** (the IPv6 equivalent of ARP) to continue functioning.

### IPv6 ACL Configuration

```cisco
R1(config)# ipv6 access-list RESTRICT-VTY
R1(config-ipv6-acl)# permit tcp 2001:DB8:ACAD:A::/64 any eq telnet
R1(config-ipv6-acl)# permit tcp any any eq 22
R1(config-ipv6-acl)# deny ipv6 any any

R1(config)# line vty 0 4
R1(config-line)# ipv6 access-class RESTRICT-VTY in
```

### Apply IPv6 ACL to an Interface

```cisco
R1(config)# interface GigabitEthernet0/1
R1(config-if)# ipv6 traffic-filter RESTRICTED-LAN out
```

> **Oral Exam Tip:** IPv6 ACLs do NOT use wildcard masks -- they use prefix-length notation. Also, remember the implicit permits for Neighbor Discovery (`nd-na` and `nd-ns`) that do not exist in IPv4 ACLs.

---

## 4.12 ACL Editing with Sequence Numbers

Every ACL line is assigned a **sequence number** (10, 20, 30, etc. by default).

### View Sequence Numbers

```cisco
R1# show access-lists
Standard IP access list BRANCH-OFFICE-POLICY
    10 permit 192.168.30.3 (8 matches)
    20 permit 192.168.40.0, wildcard bits 0.0.0.255 (5 matches)
```

### Add a New Entry at a Specific Position

```cisco
R1(config)# ip access-list standard BRANCH-OFFICE-POLICY
R1(config-std-nacl)# 25 permit 209.165.200.224 0.0.0.31
R1(config-std-nacl)# 30 deny any
```

### Delete a Specific Entry

```cisco
R1(config)# ip access-list standard BRANCH-OFFICE-POLICY
R1(config-std-nacl)# no 25
```

### Resequence an ACL

```cisco
R1(config)# ip access-list resequence BRANCH-OFFICE-POLICY 10 10
```

> **Oral Exam Tip:** Always mention that you do NOT need to delete and recreate the entire ACL to make changes. Using sequence numbers, you can surgically insert or remove individual lines.

---

## 4.13 Verification Commands

```cisco
R1# show access-lists
R1# show access-lists 1
R1# show access-lists BRANCH-OFFICE-POLICY
R1# show ip interface GigabitEthernet0/1
R1# show ipv6 access-list
R1# show running-config | include access-list
R1# clear access-list counters
```

### What to Check in `show ip interface`

Look for these lines:
```
Outgoing access list is BRANCH-OFFICE-POLICY
Inbound access list is not set
```

---

## 4.14 Common ACL Troubleshooting Mistakes

1. **Wrong source/destination network** in the ACL
2. **ACL applied in the wrong direction** (in vs out)
3. **ACL applied to the wrong interface**
4. **Wrong port number**
5. **Wrong ACL number applied** to interface
6. **ACE order errors** -- general permit before specific deny
7. **Missing return traffic rule** -- need `established` for TCP replies

### Troubleshooting Checklist

1. Is the ACL applied to the **correct interface**?
2. Is the ACL applied in the **correct direction** (in/out)?
3. Are the ACEs in the **correct order** (specific before general)?
4. Are the **source and destination addresses** correct?
5. Are the **wildcard masks** correct?
6. Is the **port number** correct?
7. Is there a **permit statement**?
8. Is `established` used where needed for return traffic?

> **Oral Exam Tip:** If an exam scenario shows an ACL that "doesn't work," systematically check: (1) correct interface, (2) correct direction, (3) correct addresses/wildcards, (4) correct order of ACEs, (5) presence of at least one permit.

---

# 5. Firewalls

## 5.1 What Firewalls Do and Don't Protect Against

A **firewall** is a network security device that monitors and controls incoming and outgoing network traffic based on predetermined security rules.

### What Firewalls Do NOT Protect Against

- **Attacks from the inside** -- firewalls are useless against insider threats
- **Connections that bypass the firewall** -- such as rogue wireless access points
- **Malware from encrypted traffic** -- antimalware protection for encrypted traffic is difficult
- **Social engineering** -- a firewall cannot stop a user from being tricked

> **Oral Exam Tip:** A classic question is "What can't a firewall protect against?" Key answer points: insider attacks, bypassed connections (wireless), encrypted malware, social engineering.

---

## 5.2 Firewall Generations

### 1st Generation: Packet Filter Firewalls

- **Operates at**: OSI Layers 3 and 4
- Provides **stateless inspection** -- each packet examined individually
- Decisions based on source/destination IP, MAC, protocol, ports
- After the decision, the firewall **forgets about the packet**
- **Strengths**: High performance, scalable, good first line of defense
- **Weaknesses**: No application-layer awareness, cannot track connection state

### 2nd Generation: Stateful Firewalls

- **Operates at**: OSI Layers 3, 4, and 5
- Maintains a **state table** tracking all active connections
- Determines if a packet is the start of a new connection, part of an existing one, or termination
- Can detect SYN floods by monitoring connection state

### Stateless vs. Stateful Comparison

| Feature | Stateless (Packet Filter) | Stateful |
|---|---|---|
| Connection tracking | No | Yes -- maintains state table |
| Return traffic | Must explicitly permit | Automatically allows for established connections |
| OSI layers | Layer 3-4 | Layer 3-5 |
| Attack detection | Very limited | Can detect SYN floods, sequence number anomalies |

> **Oral Exam Tip:** The key difference is *connection awareness*. A stateless firewall treats every packet independently. A stateful firewall tracks connections and can automatically allow return traffic.

### 3rd Generation: Application-Level Firewalls

**Two subcategories:**

#### Proxy Firewalls
- Creates **separate connections** with both communicating parties
- Breaks the direct client-server connection
- **Recreates packets** -- sanitizes malicious content
- Requires a **separate proxy per application** (HTTP, FTP, etc.)
- **Advantages**: High security, hides internal network
- **Disadvantages**: High CPU load, no transparency, affects speed

#### Deep Packet Inspection (DPI)
- Works **transparently** -- no separate connections
- Filters across **all 7 layers** of the OSI model
- Categorizes packets by application (Skype, BitTorrent, etc.)
- Can provide **IDS/IPS** functionality
- Can inspect outbound data to prevent **data exfiltration**

### 4th Generation: Next-Generation Firewalls (NGFW)

- **Application awareness**: identifies applications regardless of port
- **Deep packet inspection** with anti-malware
- **Integrated IPS**
- **SSL decryption** -- can inspect encrypted traffic
- **Security policy based on applications, users, and content**

### ML-Powered NGFWs (2020+)

- **Inline Machine Learning**: inspect files during download, block instantly if malicious
- **Zero-Delay Signatures**: signature updates within seconds
- **ML-Powered IoT Visibility**: security for IoT devices
- **Automated Policy Recommendations**: ML-based behavior analysis

> **Oral Exam Tip:** Be able to list the four generations: (1) packet filter/stateless, (2) stateful, (3) application-level (proxy + DPI), (4) NGFW / ML-powered. Know at least two features of each.

---

## 5.3 Firewall Architectures

### Dual-Homed (Two-Leg Perimeter)
- Firewall has **two interfaces** connecting two networks
- Special case: **screening router** (router acts as firewall)

### Single-Homed Bastion Host
- Heavily secured server providing proxy services
- Internet hosts can only connect to the bastion host

### Screened Host
- Combines **screening router** + **bastion host**
- **Advantage**: No single point of failure
- **Disadvantage**: If bastion host compromised, attacker enters intranet

### Screened Subnet
- Adds a **perimeter network** between intranet and Internet
- **External router (Access router)**: Protects perimeter from Internet
- **Perimeter network**: Contains bastion host; compromise only affects perimeter
- **Internal router (Choke router)**: Controls access to internal network
- Both routers have the **same** packet filter rules for internal network protection

> **Oral Exam Tip:** Be able to draw and explain the screened subnet. Key insight: even if the bastion host is compromised, the attacker is still separated from the internal network by the choke router.

### Multi-Homed (Three-Leg Perimeter / DMZ)
- Firewall has **three or more interfaces**
- Typically: Internal, External, and DMZ

---

## 5.4 The DMZ

The **DMZ** is a perimeter network segment providing services to the untrusted network.

- Security level **different from both** internal and external networks
- External attackers **cannot access the internal network** directly
- Typically hosts: web servers, email servers, DNS servers, FTP servers

> **Oral Exam Tip:** The DMZ is not "inside" or "outside" -- it is a separate zone with its own security level. Its purpose is to expose public services without exposing the internal network.

---

## 5.5 CBAC (Context-Based Access Control)

**CBAC** was introduced in **1997** as a Cisco IOS feature providing advanced traffic filtering beyond basic ACLs.

### Main Functions
- **Stateful packet filtering** at Layer 5
- **Traffic inspection**: detects SYN floods, tracks TCP sequence numbers
- **Intrusion detection**: monitors half-opened TCP connections
- **Auditing and alerting**

### How CBAC Works
1. Stores connection info in a **state table**
2. Creates **dynamic temporary ACL entries** for return traffic
3. Entries removed when connection terminates

### CBAC Limitations
- Only filters **explicitly configured** traffic
- Default was **allow all** (unlike ZPF's deny all)
- Replaced by **ZPF** in IOS 12.4(6)T (2006)

> **Oral Exam Tip:** CBAC is the predecessor to ZPF. It is stateful (Layer 5), dynamically creates temporary ACL entries, but its weakness was defaulting to allow-all. ZPF replaced it with deny-all default.

---

# 6. Zone-Based Policy Firewall (ZPF)

## 6.1 Why ZPF Replaced CBAC

ZPF was introduced in **2006 with Cisco IOS Release 12.4(6)T**.

| Feature | CBAC | ZPF |
|---|---|---|
| Default policy | **Allow all** | **Deny all** |
| Configuration model | ACL-based | Zone-based with C3PL |
| Depends on ACLs | Yes | No |
| Readability | Complex | Easy to read and troubleshoot |

> **Oral Exam Tip:** When asked why ZPF replaced CBAC: (1) ZPF defaults to deny-all (more secure), (2) not dependent on ACLs, (3) zone model scales better.

---

## 6.2 ZPF Key Characteristics

### Default Deny
- **Block all traffic** unless explicitly allowed
- No zone-pair/policy = traffic **dropped**

### Zone Membership Rules
- Interfaces assigned to **zones**; policy applied to traffic **between zones**
- **Same zone** = free communication (no filtering)
- **Multiple interfaces** can belong to one zone; **one interface** can only belong to one zone
- New interface added to a zone **inherits** zone characteristics
- If **only one zone member** assigned with no zone-pair, **all traffic dropped**

### The Self Zone
- System-defined zone representing the **router itself**
- All router interfaces are part of the self zone automatically
- By default, traffic **to the self zone is NOT filtered**
- To restrict access to the router, create explicit zone-pair with `destination self`

> **Oral Exam Tip:** The self zone is a key concept. By default, traffic TO the router is allowed from all zones. To restrict access to the router, create a zone-pair with "self" as destination.

---

## 6.3 ZPF Actions

### Inspect
- Configures **Stateful Packet Inspection (SPI)**
- **Automatically allows return traffic** and ICMP error messages
- Handles multi-channel protocols (e.g., FTP)
- **Most commonly used action**

### Pass
- Like `permit` in an ACL
- **Does NOT track** connection state
- One direction only -- need a separate policy for return traffic

### Drop
- Like `deny` in an ACL
- `log` option available

> **Oral Exam Tip:** Critical difference: `inspect` tracks state and auto-allows return traffic; `pass` does NOT -- you must explicitly create a return policy. In most scenarios, use `inspect`.

---

## 6.4 ZPF vs. ACL-Based Filtering

| Feature | ACL-Based | ZPF |
|---|---|---|
| Default behavior | Implicit deny at end of ACL | Default deny all between zones |
| Statefulness | Stateless (unless CBAC) | Stateful with `inspect` |
| Return traffic | Must explicitly permit (`established`) | Automatic with `inspect` |
| Application awareness | Limited (port-based) | Protocol-aware with NBAR |

---

## 6.5 ZPF Configuration Steps

### Step 1: Create the Security Zones

```cisco
R3(config)# zone security INSIDE
R3(config-sec-zone)# description Internal trusted network
R3(config-sec-zone)# exit

R3(config)# zone security OUTSIDE
R3(config-sec-zone)# description External untrusted network
R3(config-sec-zone)# exit
```

### Step 2: Define Traffic Classes (Class-Maps)

```cisco
R3(config)# class-map type inspect match-any INSIDE_PROTOCOLS
R3(config-cmap)# match protocol tcp
R3(config-cmap)# match protocol udp
R3(config-cmap)# match protocol icmp
R3(config-cmap)# exit
```

Can also match on ACLs:

```cisco
R3(config)# access-list 101 permit ip 10.0.0.0 0.0.0.255 any

R3(config)# class-map type inspect FOREXAMPLE
R3(config-cmap)# match access-group 101
R3(config-cmap)# match protocol tcp
R3(config-cmap)# match protocol udp
R3(config-cmap)# match protocol icmp
```

### Step 3: Specify Firewall Policies (Policy-Maps)

```cisco
R3(config)# policy-map type inspect INSIDE_TO_OUTSIDE
R3(config-pmap)# class type inspect INSIDE_PROTOCOLS
R3(config-pmap-c)# inspect
R3(config-pmap-c)# exit
R3(config-pmap)# exit
```

### Step 4: Apply Policies to Zone-Pairs

```cisco
R3(config)# zone-pair security INSIDE_TO_OUTSIDE source INSIDE destination OUTSIDE
R3(config-sec-zone-pair)# service-policy type inspect INSIDE_TO_OUTSIDE
R3(config-sec-zone-pair)# exit
```

Because `inspect` is used, return traffic (OUTSIDE -> INSIDE) is **automatically permitted**.

### Step 5: Assign Interfaces to Zones

```cisco
R3(config)# interface GigabitEthernet0/0/1
R3(config-if)# zone-member security INSIDE
R3(config-if)# exit

R3(config)# interface GigabitEthernet0/0/0
R3(config-if)# zone-member security OUTSIDE
R3(config-if)# exit
```

> **Oral Exam Tip:** Memorize the 5 steps: (1) Create zones, (2) Create class-maps, (3) Create policy-maps, (4) Create zone-pairs and attach policies, (5) Assign interfaces to zones.

---

## 6.6 Complete ZPF Configuration Example

```cisco
! STEP 1: Create Security Zones
zone security Inside
 description Inside network
zone security Outside
 description Outside network

! STEP 2: Define Traffic Classes
access-list 101 permit ip 10.0.0.0 0.0.0.255 any

class-map type inspect FOREXAMPLE
 match access-group 101
 match protocol tcp
 match protocol udp
 match protocol icmp

! STEP 3: Define Firewall Policies
policy-map type inspect InsideToOutside
 class FOREXAMPLE
  inspect

! STEP 4: Create Zone-Pairs
zone-pair security InsideToOutside source Inside destination Outside
 service-policy type inspect InsideToOutside

! STEP 5: Assign Interfaces
interface FastEthernet0/0
 zone-member security Inside

interface Serial0/0/0.100 point-to-point
 zone-member security Outside
```

---

## 6.7 ZPF Rules for the Self Zone

- By default, **all traffic to/from the router** (self zone) is **permitted**
- To restrict, create explicit zone-pairs with `source self` or `destination self`
- Self-zone policies apply to **router-generated or router-destined** traffic only, NOT traversing traffic
- The self zone is **system-defined** -- cannot delete or assign interfaces to it

---

## 6.8 Verification Commands

```cisco
R3# show zone-pair security
R3# show policy-map type inspect zone-pair sessions
R3# show class-map type inspect
R3# show zone security
R3# show policy-map type inspect
R3# show run | begin class-map
```

### Example Output: `show zone security`

```
zone self
  Description: System defined zone

zone INSIDE
  Description: Internal trusted network
  Member Interfaces:
    GigabitEthernet0/0/1

zone OUTSIDE
  Description: External untrusted network
  Member Interfaces:
    GigabitEthernet0/0/0
```

> **Oral Exam Tip:** Key verification commands: `show zone security` (zone membership), `show zone-pair security` (zone-pairs and policies), `show policy-map type inspect zone-pair sessions` (active sessions and match counters).

---

## 6.9 ZPF Design Considerations

1. **No filtering for intra-zone traffic** -- same zone communicates freely
2. **Only one zone per interface**
3. **No CBAC and ZPF on the same interface**
4. **If only one zone member** with no zone-pair, **all traffic dropped**
5. **Only explicitly allowed traffic** forwarded between zones
6. **Traffic to self zone not filtered** by default
7. **Zone-pairs are unidirectional** -- use `inspect` for automatic return traffic

### Common Design Patterns

**Internal + Internet**: INSIDE -> OUTSIDE with `inspect`. No reverse zone-pair needed.

**Internal + DMZ + Internet**: INSIDE -> OUTSIDE (inspect), INSIDE -> DMZ (inspect), OUTSIDE -> DMZ (inspect for HTTP/HTTPS). No OUTSIDE -> INSIDE or DMZ -> INSIDE.

**Guest network**: CONFROOM -> OUTSIDE with `inspect` (HTTP/HTTPS only). No CONFROOM -> INSIDE.

> **Oral Exam Tip:** In a design question, start by identifying zones, determine what traffic flows between them, decide `inspect` vs `pass`. No zone-pair = no traffic = deny by default.


---

# 7. Cisco ASA (Adaptive Security Appliance)

## 7.1 ASA Overview

The **Cisco Adaptive Security Appliance (ASA)** is a dedicated, purpose-built network security device that integrates multiple security functions into a single platform. Unlike a standard router, the ASA is designed from the ground up for security operations.

Core capabilities of the ASA include:

- **Stateful firewall** -- maintains a connection table tracking active sessions by IP address and port; return traffic for established connections is automatically permitted without requiring explicit ACL entries
- **High encryption capability** -- hardware-accelerated encryption for large-scale VPN termination
- **High-throughput traffic filtering** -- filtering large volumes of traffic at line rate
- **VPN termination** -- supports site-to-site IPsec VPN, remote-access VPN (AnyConnect with SSL/IPsec), and clientless SSL VPN
- **Extra features** -- botnet filtering, threat detection, application inspection (deep packet inspection at Layer 7), TLS decryption

> **Oral Exam Tip:** The key phrase to remember is: "A firewall is not a router, and a router is not a firewall." The ASA is purpose-built for security -- it has hardware crypto accelerators, stateful inspection engines, and a security-level-based forwarding model that routers do not have.

### 7.1.1 ASA Product Families

The ASA exists as both **hardware** and **software**. It is critical to clarify which is meant in context.

| Product | Description | Status |
|---------|-------------|--------|
| **ASA 5500-X series** | Mid-range firewall appliances (5506-X, 5508-X, 5516-X, 5525-X, 5545-X, 5555-X). Throughput from 300 Mbps to 2 Gbps stateful FW. | End-of-Life (2020-2021), End-of-Support (2025-2026) |
| **ASA 5585-X series** | High-performance data center firewalls with Security Service Processors (SSP-10 through SSP-60). Up to 40 Gbps firewall throughput, 10 million concurrent connections. | End-of-Life 2017, End-of-Support 2022 |
| **ASAv** | Virtual ASA appliance. Runs on VMware, KVM, Hyper-V, OpenStack; and in cloud on AWS, Azure, GCP, OCI. | Current |
| **ASA software** | The operating system itself (e.g., ASA 9.x), which can run on ASA hardware or on Firepower hardware. | Current |

### 7.1.2 Firepower Hardware Families

Cisco's current firewall hardware platform is the **Firepower** series, which can run either **ASA software** or **FTD (Firepower Threat Defense)** software:

| Series | Target | NGFW Throughput |
|--------|--------|-----------------|
| Firepower 1010 | SMB/SOHO | 890 Mbps |
| Firepower 1100 | Branch | 0.88-4.9 Gbps |
| Firepower 2100 | Branch/Campus | 2.3-20 Gbps |
| Firepower 3100 | Campus | 15-45 Gbps |
| Firepower 4100 | Campus/DC | 16.6-53 Gbps |
| Firepower 4200 | Data Center | 65-140 Gbps |
| Firepower 9300 | Service Provider | 68 Gbps (1x SM-56) |

The Firepower hardware runs **FXOS (Firepower Extensible Operating System)** as a supervisor/chassis manager on top of which either ASA or FTD containers/instances run.

### 7.1.3 ASA vs. FTD

| Feature | ASA Software | FTD (Firepower Threat Defense) |
|---------|-------------|-------------------------------|
| Type | Classic L3/L4 stateful firewall | Next-Generation Firewall (NGFW) with L4-L7 |
| IPS/NGIPS | No (only with legacy FirePOWER Services module) | Yes, built-in |
| Application Visibility | Limited (via inspection) | Full application-layer visibility |
| URL Filtering | No | Yes (subscription) |
| Malware protection | No | Yes -- AMP for Networks (subscription) |
| Management | CLI, ASDM, CSM, REST API | FMC, FDM, CDO, REST API |
| Multi-context | Yes | No (uses multi-instancing on FPR 3100+) |

> **Oral Exam Tip:** ASA and FTD are mutually exclusive on a given device or security module -- you run one OR the other, never both simultaneously. On Firepower hardware, ASA supports multi-context; FTD uses multi-instancing for the same purpose.

### 7.1.4 Fields of Application

- **Edge protection (external firewall):** protection against external attacks, address translation (NAT/PAT), VPN termination
- **Segmentation (internal firewall):** separating different network segments; primarily L4 firewall function where segments can only initiate limited communication with each other

---

## 7.2 ASA Modes of Operation

### 7.2.1 Routed Mode vs. Transparent Mode

**Routed Mode** (default):
- The ASA acts as a **Layer 3 hop** (router) in the network
- Each interface (or sub-interface) belongs to a different IP subnet
- Supports dynamic routing protocols (OSPF, EIGRP, RIP)
- Supports VPN termination
- Supports QoS, DHCP relay

**Transparent Mode:**
- The ASA acts as a **Layer 2 bridge** ("bump in the wire")
- Does NOT appear as a router hop -- has no IP addresses on data interfaces (only a management IP for the Bridge Virtual Interface)
- Can transport non-IP traffic (using EtherType ACLs)
- Can pass routing protocol traffic (OSPF, HSRP) transparently
- Does NOT support VPN termination (except for management traffic), dynamic routing, QoS, or DHCP relay

> **Oral Exam Tip:** Transparent mode is used when you want to insert a firewall without changing the existing IP addressing scheme or routing topology. The firewall is invisible to traceroute.

### 7.2.2 Single Context vs. Multi-Context Mode

**Single Context Mode:**
- The ASA operates as a single firewall instance with one set of policies, routing table, and interfaces.

**Multi-Context Mode:**
- A single physical (or virtual) ASA can be **partitioned into multiple virtual firewall devices**, each called a **context**.
- Each context has its own routing table, interfaces, firewall rules, and can be managed independently.
- There is a special **admin context** used to manage the other contexts.
- Multi-context mode supports routing tables, firewall features, IPS, and independent management per context.

> **Oral Exam Tip:** Active/Active failover requires multi-context mode. In active/active, contexts are distributed across two physical ASAs -- but at the context level, each context is still active on only one unit (active/standby per context).

---

## 7.3 Security Levels (0-100)

**Security levels** are the fundamental mechanism by which the ASA enforces its default security policy. Every interface (physical or logical) must be assigned a security level between **0** and **100**.

- **100** = most trusted / most secure (typically the **inside** interface)
- **0** = least trusted / least secure (typically the **outside** interface)
- **1-99** = intermediate values (commonly used for **DMZ** interfaces, e.g., 50 or 70)

### 7.3.1 Implicit Traffic Rules Based on Security Levels

| Direction | Default Behavior |
|-----------|-----------------|
| **Higher to Lower** (e.g., inside 100 -> outside 0) | **Permitted** -- all traffic is allowed unless an ACL explicitly denies it. If NAT is used, a NAT/global rule must exist. |
| **Lower to Higher** (e.g., outside 0 -> inside 100) | **Denied** -- all traffic is blocked unless an ACL explicitly permits it. Static NAT is required if address translation is in use. |
| **Same Security Level** | **Denied by default** -- traffic between interfaces with the same security level is blocked. Must enable with `same-security-traffic permit inter-interface`. Traffic entering and exiting the SAME interface is also denied unless `same-security-traffic permit intra-interface` is configured. |

```cisco
! Allow traffic between interfaces with the same security level
same-security-traffic permit inter-interface

! Allow traffic to enter and exit the same interface (useful for VPN hairpinning)
same-security-traffic permit intra-interface
```

### 7.3.2 Security Levels and Stateful Inspection

The ASA is a **stateful firewall**:
- It maintains a **connection table** (also called the state table or conn table) tracking all active sessions
- A **SYN packet** creates a new connection entry
- Subsequent packets belonging to an already-established connection are fast-tracked without full ACL re-evaluation
- **Return traffic** for connections initiated from a higher-security to a lower-security interface is automatically allowed because the connection is already in the state table (ESTABLISHED)

> **Oral Exam Tip:** This is a critical concept: outside hosts CANNOT initiate connections to inside hosts by default. Return traffic from inside-initiated connections IS allowed because of stateful inspection, not because of any ACL. To allow outside-initiated connections, you must create an explicit ACL AND (for servers behind the ASA) configure static NAT.

### 7.3.3 Automatic Security Level Assignment

When you name an interface, certain names trigger automatic security level assignment:
- `nameif inside` -- automatically sets security-level to **100**
- `nameif outside` -- automatically sets security-level to **0**
- Any other name -- defaults to **0** (must be set manually)

---

## 7.4 Interface Configuration

### 7.4.1 Interface Configuration on ASA 5510 and Above (Layer 3 Interfaces)

On ASA 5510 and above models (and Firepower hardware), physical interfaces are **Layer 3 interfaces** that can be directly assigned IP addresses, names, and security levels.

```cisco
ASA(config)# interface GigabitEthernet0/0
ASA(config-if)# nameif outside
INFO: Security level for "outside" set to 0 by default.
ASA(config-if)# security-level 0
ASA(config-if)# ip address 209.165.200.226 255.255.255.248
ASA(config-if)# no shutdown

ASA(config-if)# interface GigabitEthernet0/1
ASA(config-if)# nameif inside
INFO: Security level for "inside" set to 100 by default.
ASA(config-if)# security-level 100
ASA(config-if)# ip address 192.168.1.1 255.255.255.0
ASA(config-if)# no shutdown
```

### 7.4.2 Interface Configuration on ASA 5505 (Layer 2 Switch Ports + SVIs)

The ASA 5505 has 8 **Layer 2 switch ports** (E0/0 through E0/7). You cannot assign IP addresses directly to them. Instead:

1. Create **Switch Virtual Interfaces (SVIs)** -- logical VLAN interfaces
2. Assign names, security levels, and IP addresses to the SVIs
3. Assign physical Layer 2 ports to the appropriate VLANs

```cisco
! Step 1: Configure SVIs
CCNAS-ASA(config)# interface vlan 1
CCNAS-ASA(config-if)# nameif inside
INFO: Security level for "inside" set to 100 by default.
CCNAS-ASA(config-if)# security-level 100
CCNAS-ASA(config-if)# ip address 192.168.1.1 255.255.255.0

CCNAS-ASA(config-if)# interface vlan 2
CCNAS-ASA(config-if)# nameif outside
INFO: Security level for "outside" set to 0 by default.
CCNAS-ASA(config-if)# security-level 0
CCNAS-ASA(config-if)# ip address 209.165.200.226 255.255.255.248
CCNAS-ASA(config-if)# no shutdown

! Step 2: Assign physical ports to VLANs
CCNAS-ASA(config)# interface e0/1
CCNAS-ASA(config-if)# switchport access vlan 1
CCNAS-ASA(config-if)# no shutdown

CCNAS-ASA(config)# interface e0/0
CCNAS-ASA(config-if)# switchport access vlan 2
CCNAS-ASA(config-if)# no shutdown
```

**Base License Limitation (ASA 5505):** Only 3 named VLANs are allowed. The third VLAN requires the `no forward interface vlan` command to restrict communication with one of the other VLANs. The Security Plus license removes this restriction (allows up to 20 named VLANs).

### 7.4.3 VLAN Sub-interfaces (802.1Q Trunking)

On ASA 5510+ and Firepower hardware, sub-interfaces support 802.1Q VLAN tagging:

```cisco
! The physical interface carries no config except no shutdown
ciscoasa(config)# interface gigabitethernet 0/1
ciscoasa(config-if)# no nameif
ciscoasa(config-if)# no ip address
ciscoasa(config-if)# no shutdown

! Sub-interface for VLAN 10
ciscoasa(config)# interface gigabitethernet 0/1.1
ciscoasa(config-subif)# vlan 10
ciscoasa(config-subif)# nameif inside1
ciscoasa(config-subif)# security-level 80
ciscoasa(config-subif)# ip address 192.168.1.1 255.255.255.0

! Sub-interface for VLAN 20
ciscoasa(config)# interface gigabitethernet 0/1.2
ciscoasa(config-subif)# vlan 20
ciscoasa(config-subif)# nameif inside2
ciscoasa(config-subif)# security-level 90
ciscoasa(config-subif)# ip address 192.168.2.1 255.255.255.0
```

### 7.4.4 EtherChannel (Port-Channel)

ASA supports LACP-based EtherChannel (Active/Active only, no PAgP):

```cisco
! Add physical interfaces to channel-group
interface GigabitEthernet0/1
 channel-group 1 mode active
 no shutdown
interface GigabitEthernet0/2
 channel-group 1 mode active
 no shutdown

! Configure the logical Port-Channel interface
interface Port-Channel 1
 nameif INSIDE
 ip address 136.1.93.17 255.255.255.0
```

### 7.4.5 Verification Commands for Interfaces

```cisco
! Show brief interface status (NOTE: syntax differs from IOS)
show interface ip brief

! Show Layer 3 addressing
show ip address

! Show detailed interface information
show interface GigabitEthernet0/0

! Show running-config for a specific interface
show running-config interface GigabitEthernet0/1

! ASA 5505: show VLAN-to-port assignments
show switch vlan

! Show all addresses assigned
show address
```

> **Oral Exam Tip:** The ASA command is `show interface ip brief`, NOT `show ip interface brief` as on IOS routers. This is a common exam trick question. Also note that `show` commands work from ANY mode on the ASA -- you do NOT need the `do` prefix as on IOS.

---

## 7.5 ASA CLI Basics

### 7.5.1 CLI Modes

The ASA CLI is similar to IOS but has important differences:

| Mode | Prompt | Purpose |
|------|--------|---------|
| **User EXEC** | `ciscoasa>` | Limited commands, basic monitoring |
| **Privileged EXEC** | `ciscoasa#` | Full monitoring, management, entering config mode |
| **Global Configuration** | `ciscoasa(config)#` | System-wide configuration |
| **Interface Config** | `ciscoasa(config-if)#` | Interface-specific settings |
| **Monitor (ROMMON)** | `rommon>` | Boot-level recovery (press ESC during boot) |

**Key differences from IOS:**
- `show` commands can be issued from **any** mode without `do`
- The `help` command provides brief descriptions of available commands
- Press `q` to exit paged output from `show` commands

### 7.5.2 Basic Management Commands

```cisco
! Set hostname
hostname CCNAS-ASA

! Set domain name
domain-name ccnasecurity.com

! Set privileged EXEC (enable) password
! NOTE: there is NO "enable secret" command on ASA
enable password class

! Set Telnet/SSH login password (legacy)
passwd cisco

! Set number of displayed lines
pager lines 24

! Set console timeout (0 = never timeout)
console timeout 0

! Customize the prompt
prompt hostname context priority state
```

### 7.5.3 Common IOS-to-ASA Command Mapping

| IOS Router Command | Equivalent ASA Command |
|--------------------|----------------------|
| `enable secret password` | `enable password password` |
| `line vty 0 4` / `password` / `login` | `passwd password` |
| `ip route` | `route outside` |
| `show ip interface brief` | `show interface ip brief` |
| `show ip route` | `show route` |
| `show vlan` | `show switch vlan` |
| `show ip nat translations` | `show xlate` |
| `copy running-config startup-config` | `write memory` (or `write mem` or `wr`) |
| `erase startup-config` | `write erase` |

### 7.5.4 Factory Defaults and Configuration Management

```cisco
! Restore factory default configuration
ciscoasa(config)# configure factory-default

! Save running configuration to startup
ciscoasa# write memory
! or
ciscoasa# copy running-config startup-config

! Erase startup configuration
ciscoasa# write erase

! View configurations
ciscoasa# show running-config
ciscoasa# show startup-config

! Reload the device
ciscoasa# reload
```

> **Oral Exam Tip:** `erase startup-config` does NOT work on ASA -- you must use `write erase`. Similarly, there is no `enable secret` on ASA -- only `enable password`. These are classic differences between IOS and ASA CLI.

---

## 7.6 NAT/PAT on ASA

Starting with ASA version 8.3, NAT is configured using **network objects**. The ASA supports two categories of NAT configuration:

### 7.6.1 Object NAT (Auto NAT) vs. Twice NAT (Manual NAT)

**Object NAT (Auto NAT):**
- The NAT rule is defined **inside** a network object definition
- Translates the source address only
- Simpler to configure for straightforward scenarios
- The ASA automatically orders these rules (Section 2)

**Twice NAT (Manual NAT):**
- The NAT rule is defined as a **standalone `nat` command** at global config level
- Can translate **both source AND destination** addresses in a single rule
- Destination translation is always static
- Administrator controls the order (Section 1 by default, or Section 3 with `after-auto`)

### 7.6.2 NAT Order of Operations (NAT Sections)

The ASA processes NAT rules in a strict order across three sections:

1. **Section 1 -- Twice NAT (before auto):** Manual/Twice NAT rules in administrator-defined order. This is the default location for Twice NAT rules.
2. **Section 2 -- Object NAT (auto):** Auto NAT rules, automatically ordered:
   - Static rules first, then dynamic rules
   - Within each type: smaller address ranges first, then larger
   - Same-size ranges: lower IP addresses first
   - Same IP: alphabetical by object-group name
3. **Section 3 -- Twice NAT (after auto):** Twice NAT rules placed here with the `after-auto` keyword, in administrator-defined order.

> **Oral Exam Tip:** Understanding NAT order of operations is critical. The ASA processes Section 1 first, then Section 2, then Section 3. Within Section 2, static NAT rules take precedence over dynamic. First match wins.

### 7.6.3 Dynamic NAT (Many-to-Many)

Dynamic NAT maps internal addresses to a **pool of public addresses** on a one-to-one basis. When the pool is exhausted, new connections are denied.

```cisco
! Step 1: Create a network object for the public IP pool
object network PUBLIC-IP-POOL
 range 209.165.200.240 209.165.200.245

! Step 2: Create a network object for the inside network and bind NAT
object network INSIDE-NET
 subnet 192.168.1.0 255.255.255.0
 nat (inside,outside) dynamic PUBLIC-IP-POOL
```

### 7.6.4 Dynamic PAT (Many-to-One, Overload)

Dynamic PAT translates many internal addresses to a **single** outside address (or the outside interface address) using port numbers to differentiate sessions. This is the most common NAT deployment.

**Using the outside interface address:**
```cisco
object network INSIDE-NET
 subnet 192.168.1.0 255.255.255.0
 nat (inside,outside) dynamic interface
```

**Using a specific outside IP address:**
```cisco
object network INSIDE-NET
 subnet 192.168.1.0 255.255.255.0
 nat (inside,outside) dynamic 209.165.200.229
```

> **Oral Exam Tip:** `dynamic interface` means use the IP of the mapped (outside) interface for PAT. The parentheses and comma in `(inside,outside)` are required syntax -- `(real-interface, mapped-interface)`.

### 7.6.5 Static NAT (One-to-One)

Static NAT creates a permanent, bidirectional mapping between an inside (real) IP address and an outside (mapped) IP address. Typically used for servers that must be reachable from outside.

```cisco
! Map DMZ server 192.168.2.3 to public IP 209.165.200.227
object network DMZ-SERVER
 host 192.168.2.3
 nat (dmz,outside) static 209.165.200.227
```

**Important:** Static NAT alone does NOT allow outside-initiated traffic. You must ALSO configure an ACL to permit the desired traffic:

```cisco
access-list OUTSIDE-DMZ permit ip any host 192.168.2.3
access-group OUTSIDE-DMZ in interface outside
```

**Static NAT with Port Translation (Static PAT):**
```cisco
object network obj-WEBSRV
 host 10.3.19.50
 nat (inside,outside) static 198.51.100.50 service tcp 443 443
```

### 7.6.6 Twice NAT Examples

Twice NAT syntax:
```
nat [(REAL_IFC,MAPPED_IFC)] [LINE | after-auto [LINE]]
    source {static | dynamic} REAL_SRC_OBJ MAPPED_SRC_OBJ
    [destination static MAPPED_DST_OBJ REAL_DST_OBJ]
    [service REAL_SVC_OBJ MAPPED_SVC_OBJ]
```

**Important:** In the `destination` clause, the order is reversed: mapped first, then real.

**NAT exemption for VPN (Identity NAT / No-NAT):**
```cisco
object network obj-S2S-net
 subnet 192.168.16.0 255.255.255.0
object network obj-S2S-peer
 subnet 192.168.78.0 255.255.255.0

! Traffic between VPN subnets should NOT be translated
nat (inside,outside) source static obj-S2S-net obj-S2S-net destination static obj-S2S-peer obj-S2S-peer
```

**Dynamic source PAT with Twice NAT:**
```cisco
nat (dmz1,outside) source dynamic obj-DMZ1 interface
```

### 7.6.7 NAT Verification Commands

```cisco
! Show all NAT rules with hit counters
show nat

! Show active NAT translations (the xlate table)
show xlate

! Show NAT configuration from running-config
show run nat
show run object

! Clear NAT hit counters
clear nat counters

! Clear all translations
clear xlate
```

Example output:
```
CCNAS-ASA# show nat
Auto NAT Policies (Section 2)
1 (dmz) to (outside) source static DMZ-SERVER 209.165.200.227
    translate_hits = 0, untranslate_hits = 4
2 (inside) to (outside) source dynamic INSIDE-NET interface
    translate_hits = 4, untranslate_hits = 0

CCNAS-ASA# show xlate
Flags: D - DNS, i - dynamic, r - portmap, s - static, I - identity, T - twice
NAT from dmz:192.168.2.3 to outside:209.165.200.227 flags s idle 0:22:58 timeout 0:00:00
```

> **Oral Exam Tip:** `show xlate` flags tell the translation type: `s` = static, `i` = dynamic, `r` = portmap (PAT), `T` = twice NAT. The `translate_hits` counter counts packets going in the configured direction; `untranslate_hits` counts packets in the reverse direction.

---

## 7.7 ASA ACLs (Access Control Lists)

### 7.7.1 Similarities Between ASA and IOS ACLs

- Both are made up of individual **ACEs (Access Control Entries)**
- Both are processed **sequentially from top to bottom** -- first match wins
- Both have an **implicit deny all** at the end
- Both support **remarks** and **time-based** ACLs
- Both follow the rule: **one ACL per interface, per protocol, per direction**

### 7.7.2 Key Differences Between ASA and IOS ACLs

| Feature | ASA ACL | IOS ACL |
|---------|---------|---------|
| Mask type | **Subnet mask** (e.g., 255.255.255.0) | **Wildcard mask** (e.g., 0.0.0.255) |
| Numbering | **Named only** (the name can be a number, but they are still named ACLs) | Both numbered and named |
| Security levels | ACLs work alongside security-level-based implicit rules | No security level concept |

> **Oral Exam Tip:** This is one of the most frequently tested differences: ASA uses SUBNET MASKS (e.g., `192.168.1.0 255.255.255.0`), NOT wildcard masks. If you accidentally use wildcard notation on the ASA, the ACL will match the wrong traffic.

### 7.7.3 Five Types of ASA ACLs

| ACL Type | Description |
|----------|-------------|
| **Extended** | Most common. Filters on source/destination address, port, and protocol. |
| **Standard** | Matches destination address only. Used for routing protocol redistribution (e.g., OSPF), NOT for interface filtering. |
| **IPv6** | Used for IPv6 traffic filtering. |
| **Webtype** | Used for clientless SSL VPN URL filtering. |
| **EtherType** | Filters on Layer 2 network protocol. Only used in **transparent mode**. |

### 7.7.4 ACL Uses

- **Through-traffic filtering:** Filter transit traffic passing from one interface to another. Requires applying ACL to an interface.
- **To-the-box filtering (management access rule):** Control Telnet, SSH, SNMP, and HTTPS traffic destined to the ASA itself. Uses `control-plane` keyword.
- **Identify traffic for NAT** (Policy NAT)
- **Identify traffic for VPN** (crypto ACLs / interesting traffic)
- **Identify traffic for MPF** (class-map match)
- **Control OSPF route redistribution** (standard ACL)

### 7.7.5 ACL Configuration Syntax

```cisco
access-list ACL_NAME [line LINE-NO] {extended | standard} {permit | deny}
  {tcp | udp | ip | icmp | PROTOCOL}
  {any | SRC_IP SRC_MASK | host SRC_IP | object OBJ | object-group OBJ_GRP}
  {any | DST_IP DST_MASK | host DST_IP | object OBJ | object-group OBJ_GRP}
  [{eq | lt | gt | neq | range} PORT [PORT]]
```

### 7.7.6 ACL Examples

**Permit all inside traffic outbound:**
```cisco
access-list ACL-IN-1 extended permit ip any any
access-group ACL-IN-1 in interface inside
```

**Deny a specific host, permit everything else:**
```cisco
access-list ACL-IN-2 extended deny tcp 192.168.1.0 255.255.255.0 host 209.165.201.228
access-list ACL-IN-2 extended permit ip any any
access-group ACL-IN-2 in interface inside
```

**Permit only specific traffic to a host (all else denied by implicit deny):**
```cisco
access-list ACL-IN-3 extended permit tcp 192.168.1.0 255.255.255.0 host 209.165.201.228
access-group ACL-IN-3 in interface inside
```

**Block web access to a specific server, allow all other traffic:**
```cisco
access-list ACL-IN-4 extended deny tcp any host 209.165.201.229 eq www
access-list ACL-IN-4 extended permit ip any any
access-group ACL-IN-4 in interface inside
```

**Permit outside hosts to DMZ servers for HTTP and SMTP with logging:**
```cisco
access-list ACL-IN remark Permit PC-A -> Server A for HTTP / SMTP
access-list ACL-IN extended permit tcp host 209.165.201.1 host 209.165.202.131 eq http
access-list ACL-IN extended permit tcp host 209.165.201.1 host 209.165.202.131 eq smtp
access-list ACL-IN extended deny ip any any log
access-group ACL-IN in interface outside
```

### 7.7.7 Applying ACLs -- access-group

```cisco
access-group ACL_NAME {in | out} interface INTERFACE_NAME [per-user-override | control-plane]
```

- `in` / `out` -- direction of filtering
- `interface` -- specifies which named interface
- `per-user-override` -- allows downloadable user ACLs to override the interface ACL
- `control-plane` -- applies the rule to management (to-the-box) traffic only

### 7.7.8 Objects and Object Groups

Objects and object groups make ACLs more readable and modular. They group IP addresses, subnets, ports, and protocols into reusable named containers.

**Network Object (single value):**
```cisco
object network WEB-SERVER
 host 10.0.0.1

object network DMZ-SUBNET
 subnet 192.168.2.0 255.255.255.0

object network IP-RANGE
 range 192.168.1.10 192.168.1.50
```

**Service Object (single value):**
```cisco
object service HTTPS-SVC
 service tcp destination eq 443
```

**Network Object Group (multiple values):**
```cisco
object-group network WEB_SRV
 network-object host 10.0.0.1
 network-object host 10.0.0.2

object-group network DMZ_SUBNET
 network-object 10.0.0.0 255.255.255.0
```

**Service Object Group:**
```cisco
object-group service DMZ_SERVICES tcp
 port-object eq http
 port-object eq https
 port-object range 21 23
```

**Nesting Object Groups:**
```cisco
object-group network ALL
 group-object WEB_SRV
 group-object DMZ_SUBNET
```

**Using Object Groups in ACLs:**
```cisco
access-list OUTSIDE-IN extended permit tcp any object-group WEB_SRV eq 80
access-list OUTSIDE-IN extended permit tcp any object-group DMZ_SUBNET object-group DMZ_SERVICES
```

> **Oral Exam Tip:** Using object groups reduces the number of ACE lines you write, but the total number of expanded elements remains the same. For example, 2 hosts x 2 servers x 2 protocols = 8 elements regardless of whether you use individual ACEs or object groups.

### 7.7.9 ACL Verification Commands

```cisco
! Show ACL configuration from running-config
show running-config access-list

! Show ACLs with hit counts and expanded object-group entries
show access-list
show access-list ACL-IN brief

! Show access-group bindings
show running-config access-group
```

### 7.7.10 ACL Logging

ACL deny events generate syslog messages at level 4 (%ASA-4-106023). You can customize logging per ACE:

```cisco
access-list OUT extended deny ip any any log 6 interval 300
```

This logs at severity 6 (informational), with a 300-second aggregation interval for repeated matches. The ASA maintains deny flow counters (default max 4096):

```cisco
access-list deny-flow-max 4096
access-list alert-interval 300
```

---

## 7.8 Modular Policy Framework (MPF)

The **Modular Policy Framework (MPF)** is the ASA mechanism for configuring advanced traffic handling such as application inspection, connection limits, QoS, and policing. It follows a hierarchical, object-oriented model with three components:

### 7.8.1 Three Components of MPF

1. **Class Map** -- defines WHICH traffic to act upon (the match criteria)
2. **Policy Map** -- defines WHAT actions to take on the matched traffic
3. **Service Policy** -- defines WHERE to apply the policy (globally or on a specific interface)

### 7.8.2 Class Map Configuration

Class maps identify Layer 3/4 traffic to be processed:

```cisco
! Create a class map
class-map CLASS-TFTP
 match access-list TFTP-TRAFFIC

! Alternative: match all traffic
class-map ALL-TRAFFIC
 match any

! For management traffic destined to the ASA itself
class-map type management MGMT-CLASS
 match ...
```

Reserved names: `class-default` and names beginning with `_internal` or `_default` are reserved.

### 7.8.3 Policy Map Configuration

Policy maps bind class maps to actions:

```cisco
policy-map POLICY-TFTP
 class CLASS-TFTP
  inspect tftp
```

Available actions include:
- `inspect` -- enables protocol inspection (deep packet inspection)
- `set connection` -- sets connection parameters (timeouts, limits)
- `police` -- rate-limits traffic in the class

### 7.8.4 Service Policy Configuration

Service policies attach policy maps to interfaces or apply them globally:

```cisco
! Apply globally (to all interfaces without a specific policy)
service-policy POLICY-TFTP global

! Apply to a specific interface
service-policy POLICY-TFTP interface outside
```

**Rules:**
- There can be only **one global** service policy
- Interface service policies take precedence over the global policy for a given feature
- There can be only one service policy per interface

### 7.8.5 Complete MPF Configuration Example

```cisco
! Step 1 (optional): Create ACL to identify specific traffic
access-list TFTP-TRAFFIC permit udp any any eq 69

! Step 2: Create class map
class-map CLASS-TFTP
 match access-list TFTP-TRAFFIC

! Step 3: Create policy map and assign actions
policy-map POLICY-TFTP
 class CLASS-TFTP
  inspect tftp

! Step 4: Apply as service policy
service-policy POLICY-TFTP global
```

### 7.8.6 Default MPF Policy

The ASA automatically creates a default MPF policy that inspects common protocols. This default policy consists of:

**Default Class Map:**
```cisco
class-map inspection_default
 match default-inspection-traffic
```

**Default Policy Map:**
```cisco
policy-map global_policy
 class inspection_default
  inspect dns preset_dns_map
  inspect ftp
  inspect h323 h225
  inspect h323 ras
  inspect ip-options
  inspect netbios
  inspect rsh
  inspect rtsp
  inspect skinny
  inspect esmtp
  inspect sqlnet
  inspect sunrpc
  inspect tftp
  inspect sip
  inspect xdmcp
```

**Default Service Policy:**
```cisco
service-policy global_policy global
```

**Adding ICMP inspection to the default policy:**
```cisco
policy-map global_policy
 class inspection_default
  inspect icmp
```

> **Oral Exam Tip:** By default, ICMP is NOT inspected by the ASA global policy. This means that if an inside host pings an outside host, the echo request goes out (higher to lower security), but the echo reply is blocked because it is not recognized as return traffic. You must add `inspect icmp` to the default policy to allow ICMP replies through.

### 7.8.7 MPF Verification Commands

```cisco
! Show class map configuration
show running-config class-map

! Show policy map configuration
show running-config policy-map

! Show service policy with statistics
show service-policy

! Show service policy configuration
show running-config service-policy

! Clear all policy maps
clear configure policy-map

! Clear all service policies
clear configure service-policy

! Clear service policy statistics only
clear service-policy
```

---

## 7.9 ASA DHCP Server/Client Configuration

### 7.9.1 DHCP Server

The ASA can act as a DHCP server for hosts on its interfaces:

```cisco
! Define the DHCP address pool for the inside interface
dhcpd address 192.168.1.5-192.168.1.36 inside

! Specify DNS server for clients
dhcpd dns 209.165.201.2

! Optionally set default gateway (ASA uses its own IP by default)
dhcpd option 3 ip 192.168.1.1

! Enable the DHCP server on the inside interface
dhcpd enable inside
```

**Note:** The ASA 5505 Base license limits the DHCP pool to 32 addresses.

### 7.9.2 DHCP Client

The ASA outside interface can obtain its IP address via DHCP from an ISP:

```cisco
interface GigabitEthernet0/0
 nameif outside
 security-level 0
 ip address dhcp setroute
```

The `setroute` keyword automatically installs a default route from the DHCP-provided gateway.

### 7.9.3 DHCP Auto-Configuration

```cisco
! Automatically pass DHCP parameters received on outside to inside clients
dhcpd auto_config outside
```

### 7.9.4 DHCP Verification Commands

```cisco
! Show DHCP server configuration
show running-config dhcpd

! Show DHCP bindings
show dhcpd binding

! Show DHCP statistics
show dhcpd statistics
```

---

## 7.10 ASA Routing

### 7.10.1 Static Routes

```cisco
! Syntax: route INTERFACE NETWORK MASK GATEWAY [METRIC]
route outside 0.0.0.0 0.0.0.0 209.165.200.225

! Route to a specific network via DMZ
route dmz 192.168.1.0 255.255.255.0 192.168.2.1
```

### 7.10.2 Default Route

```cisco
! "Quad-zero" default route pointing to ISP gateway
route outside 0.0.0.0 0.0.0.0 209.165.200.225
```

### 7.10.3 OSPF Configuration

```cisco
router ospf 1
 router-id 150.1.16.16
 network 136.1.19.16 255.255.255.255 area 0
 network 172.16.10.1 255.255.255.255 area 0
 default-information originate always
 passive-interface Ethernet0/2

! OSPF authentication on an interface
interface Ethernet0/1
 ospf authentication message-digest
 ospf message-digest-key 1 md5 0 STRONG
```

### 7.10.4 EIGRP Configuration

```cisco
router eigrp 1
 no auto-summary
 network 136.1.19.0 255.255.255.0
 network 136.1.29.16 255.255.255.0
 passive-interface default
 no passive-interface VLAN19
 no passive-interface VLAN29

! EIGRP authentication on an interface
interface Ethernet0/1
 authentication key eigrp 1 EIGRP-PASS key-id 1
 authentication mode eigrp 1 md5
```

### 7.10.5 IP SLA Monitoring for Tracked Static Routes

```cisco
sla monitor 2
 type echo protocol ipIcmpEcho 136.1.19.1 interface VLAN19
 request-data-size 1392
 timeout 1000
 threshold 100
 frequency 5

sla monitor schedule 2 life forever start-time now
track 100 rtr 2 reachability
route VLAN19 150.1.111.111 255.255.255.255 136.1.19.1 track 100
```

### 7.10.6 Policy-Based Routing (PBR)

```cisco
! Create ACL to match interesting traffic
access-list testacl extended permit ip 10.1.1.0 255.255.255.0 10.2.2.0 255.255.255.0

! Create route-map with ACL match and next-hop action
route-map testmap permit 10
 match ip address testacl
 set ip next-hop 1.1.1.10

! Apply route-map to incoming interface
interface Ethernet1/3
 policy-route route-map testmap
```

### 7.10.7 Routing Verification Commands

```cisco
! Show the full routing table
show route

! Show OSPF neighbors and OSPF routes
show ospf neighbor
show route ospf

! Show EIGRP neighbors and EIGRP routes
show eigrp neighbor
show route eigrp

! Show IP SLA state
show sla monitor configuration
show sla monitor operational-state
show track
```

> **Oral Exam Tip:** On the ASA the command is `show route`, NOT `show ip route`. Dynamic routing configuration syntax is largely the same as on IOS routers.

---

## 7.11 ASA Failover / High Availability (HA)

### 7.11.1 Failover Requirements

To configure failover, the two ASA units must:
- Be the **same model** (same hardware platform)
- Have the **same hardware configuration** (same number/type of interfaces)
- Run the **same major and minor software version**
- Have appropriate licensing

### 7.11.2 Active/Standby Failover

- Only **one** ASA actively forwards traffic; the other is the standby
- Works in both **single-context** and **multi-context** modes
- The simplest and most common HA deployment

### 7.11.3 Active/Active Failover

- **Both** ASA units forward traffic simultaneously
- Requires **multi-context** mode
- Contexts are organized into **failover groups**, and each group has a designated active unit
- **Important:** At the context level, this is still active/standby -- each context is active on only one unit. The "active/active" refers to the hardware level where both units process traffic (for different contexts).

### 7.11.4 Stateless vs. Stateful Failover

**Stateless (Regular) Failover -- Data sent over failover link:**
- State information (active or standby)
- Hello messages (keep-alive)
- Link state monitoring
- MAC addresses
- Configuration synchronization

**Result:** During failover, all active connections are **lost** and must be re-established.

**Stateful Failover -- Additional data replicated:**
- NAT translation table
- TCP connection states
- UDP connection states
- ARP table
- L2 bridge table (transparent mode)
- HTTP connection states (if HTTP replication is enabled)
- ISAKMP and IPSec SA table

**Result:** During failover, active connections are **preserved** and continue without interruption.

### 7.11.5 Failover Triggers

- Hardware/power failure
- Software failure
- Too many monitored interfaces failing (`monitor-interface`)
- Manual failover (administrator-initiated)

**Important:** If the failover link itself fails, failover switching is **disabled** (both units continue in their current state, but no further failover can occur).

### 7.11.6 Failover Link Configuration

**On the PRIMARY (Active) unit:**
```cisco
! Enable the failover interface
interface Ethernet1/8
 no shutdown

! Designate this unit as primary
failover lan unit primary

! Associate failover with physical interface
failover lan interface FAILOVER Ethernet1/8

! Enable stateful failover on the same link
failover link FAILOVER Ethernet1/8

! Assign IP addresses for both units on the failover link
failover interface ip FAILOVER 192.168.99.1 255.255.255.0 standby 192.168.99.2

! Enable failover
failover
```

**On the SECONDARY (Standby) unit:**
```cisco
interface Ethernet1/8
 no shutdown

failover lan unit secondary
failover lan interface FAILOVER Ethernet1/8
failover link FAILOVER Ethernet1/8
failover interface ip FAILOVER 192.168.99.1 255.255.255.0 standby 192.168.99.2
failover
```

**Configuration procedure:**
1. Configure all interfaces on the Primary ASA (the Standby must NOT be connected yet)
2. Allocate 2 IP addresses per data interface (one for each unit) and a separate subnet for the failover link
3. Configure failover on the Primary and save (`write memory`)
4. Configure the failover interface on the Secondary and save
5. Connect the two units -- configuration replication begins automatically
6. Verify with `show failover`

### 7.11.7 Interface Monitoring

```cisco
! Monitor a specific interface for failover decisions
monitor-interface INSIDE
```

If the active unit has fewer working monitored interfaces than the standby, a failover switch occurs.

Interface failure detection sequence:
1. Hello messages
2. Link state
3. Network activity
4. ARP
5. Ping test

### 7.11.8 Failover Verification Commands

```cisco
! Show complete failover status
show failover

! Show failover state history
show failover history

! Force manual failover
failover active

! Force failover to standby
no failover active
```

Console messages during synchronization:
```
Beginning Configuration Replication: Sending to Mate
End Configuration Replication to Mate
```

> **Oral Exam Tip:** Configuration can only be changed on the **active** unit. Changes are automatically replicated to the standby. The failover link must be on a dedicated interface or VLAN -- it carries state information, hello messages, and configuration sync data.

---

## 7.12 ASA Management

### 7.12.1 ASDM (Adaptive Security Device Manager)

**ASDM** is a Java-based GUI that runs over HTTPS and provides graphical configuration, monitoring, and troubleshooting. It translates GUI actions into CLI commands.

```cisco
! Enable the HTTPS server on the ASA
http server enable

! Allow HTTPS management from the inside network
http 192.168.1.0 255.255.255.0 inside

! Allow HTTPS management from a specific host
http 192.168.1.10 255.255.255.255 inside

! Specify the ASDM image file (if multiple exist)
asdm image disk0:/asdm-741.bin

! Configure authentication for ASDM access
aaa authentication http console LOCAL
username admin password cisco123
```

Access ASDM by browsing to `https://<ASA_IP>` from a permitted host.

### 7.12.2 SSH Configuration

```cisco
! Configure local authentication for SSH
aaa authentication ssh console LOCAL
username admin password cisco123

! Generate RSA key pair (required for SSH)
crypto key generate rsa modulus 1024
! or with a label:
crypto key generate rsa label SSH modulus 2048

! Allow SSH from inside network
ssh 192.168.1.0 255.255.255.0 inside

! Allow SSH from a specific outside host
ssh 172.16.3.3 255.255.255.255 outside

! Allow SSH from a management interface
ssh 192.168.1.100 255.255.255.255 management

! Set SSH idle timeout (1-60 minutes, default 5)
ssh timeout 10
```

### 7.12.3 AAA Configuration

```cisco
! Local authentication for SSH
aaa authentication ssh console LOCAL

! Local authentication for serial console
aaa authentication serial console LOCAL

! Local authentication for ASDM/HTTPS
aaa authentication http console LOCAL

! Local authentication for enable mode
aaa authentication enable console LOCAL

! Using external TACACS+ server
aaa-server TACACS protocol tacacs+
 max-failed-attempts 2
 reactivation-mode depletion deadtime 20

aaa-server TACACS (inside) host 10.1.1.1
 key TACPlusUauthKey

! Fall back to LOCAL if TACACS servers are unreachable
aaa authentication ssh console TACACS LOCAL
aaa authentication http console TACACS LOCAL
aaa authentication enable console TACACS LOCAL

! Accounting
aaa accounting enable console TACACS
aaa accounting command TACACS
```

### 7.12.4 Logging (Syslog)

```cisco
! Enable logging
logging enable

! Log to syslog server
logging host management 192.168.1.100

! Log to console, monitor (SSH/Telnet), and buffer
logging console 6
logging monitor 6
logging buffered 6

! Redirect console messages to current session
terminal monitor

! Syslog message format: %ASA-Level-MessageID: Message text
! Levels: 0=emergencies ... 7=debugging (level 0 messages are never generated)
```

### 7.12.5 Management Verification Commands

```cisco
! Show AAA server configuration
show aaa-server protocol tacacs

! Show logging configuration and logs
show logging

! Show SSH sessions
show ssh sessions

! Show ASDM sessions
show asdm sessions

! Show NTP status
show ntp status
show ntp association detail
show clock
```

---

## 7.13 DMZ Configuration on ASA

A **DMZ (Demilitarized Zone)** hosts servers that need to be accessible from both inside and outside networks (e.g., web servers, mail servers). The DMZ interface is assigned a security level between inside (100) and outside (0), commonly **50 or 70**.

### 7.13.1 DMZ Interface Configuration (ASA 5505)

```cisco
! Create DMZ VLAN
interface vlan 3
 ip address 192.168.2.1 255.255.255.0
 no forward interface vlan 1       ! Required for Base license -- blocks DMZ->inside
 nameif dmz
 security-level 70
 no shutdown

! Assign physical port to DMZ VLAN
interface Ethernet0/2
 switchport access vlan 3
 no shutdown
```

### 7.13.2 DMZ Interface Configuration (ASA 5510+ / Firepower)

```cisco
interface GigabitEthernet0/2
 nameif dmz
 security-level 70
 ip address 192.168.2.1 255.255.255.0
 no shutdown
```

### 7.13.3 DMZ with Static NAT and ACL (Complete Example)

```cisco
! Step 1: Configure DMZ interface (see above)

! Step 2: Configure static NAT for the DMZ server
object network dmz-server
 host 192.168.2.3
 nat (dmz,outside) static 209.165.200.227

! Step 3: Configure ACL to permit outside access to DMZ server
access-list OUTSIDE-DMZ permit ip any host 192.168.2.3
access-group OUTSIDE-DMZ in interface outside

! Step 4: Configure PAT for inside network
object network INSIDE-NET
 subnet 192.168.1.0 255.255.255.0
 nat (inside,outside) dynamic interface
```

### 7.13.4 DMZ Traffic Flow Rules

| Direction | Behavior |
|-----------|----------|
| Inside (100) -> DMZ (70) | **Permitted** by default (higher to lower security level) |
| Inside (100) -> Outside (0) | **Permitted** by default (with NAT) |
| DMZ (70) -> Outside (0) | **Permitted** by default (higher to lower) |
| Outside (0) -> DMZ (70) | **Denied** unless ACL explicitly permits + static NAT configured |
| Outside (0) -> Inside (100) | **Denied** unless ACL explicitly permits + static NAT configured |
| DMZ (70) -> Inside (100) | **Denied** unless ACL explicitly permits (lower to higher) |

### 7.13.5 DMZ Verification Commands

```cisco
! Show interface status including DMZ
show interface ip brief
show ip address

! Show VLAN assignments (ASA 5505)
show switch vlan

! Show NAT translations for DMZ
show nat
show xlate

! Show DMZ interface configuration
show running-config interface vlan 3
! or for non-5505:
show running-config interface GigabitEthernet0/2
```

> **Oral Exam Tip:** On the ASA 5505 with a Base license, the DMZ (third VLAN) requires the `no forward interface vlan 1` command, which prevents the DMZ from initiating connections to the inside network. This is a licensing restriction, not a design choice. With the Security Plus license, you can use ACLs instead for more granular control.

---

## 7.14 Diagnostics and Troubleshooting

### 7.14.1 Packet Tracer

The `packet-tracer` command simulates a packet flowing through the ASA and shows the result of each processing phase (ACL, NAT, routing, inspection, etc.):

```cisco
packet-tracer input INTERFACE {icmp | rawip | tcp | udp} SRC_ADDR
  {ICMP_TYPE ICMP_CODE | SRC_PORT} DST_ADDR DST_PORT [detailed]

! Example: simulate TCP traffic from DMZ to inside
packet-tracer input dmz tcp 192.168.118.100 21212 10.35.211.87 443
```

Output shows each phase with ALLOW/DROP result.

### 7.14.2 Packet Capture

```cisco
! Create a capture on an interface
capture test interface dmz buffer 20000 packet-length 1522

! Filter capture with an ACL
capture test access-list CAPTURE-ACL interface outside

! View capture on the ASA
show capture test

! Download capture as PCAP file
! Via browser: https://asa_ip/capture/test/pcap
! Via TFTP:
copy /pcap capture:test tftp:

! Delete a capture
no capture test
```

### 7.14.3 Password Recovery

**ASA hardware:**
1. Reboot the device
2. Press ESC during boot to enter ROMMON
3. Issue the `confreg` command, note the current value
4. Change configuration register to skip startup-config ("disable system configuration? yes")
5. `boot` to start the software
6. Enter enable mode, load config: `copy startup-config running-config`
7. Change passwords (`enable password`, `username`)
8. Restore confreg: `config-register <original_value>`
9. Save: `write memory`

**Firepower hardware:**
1. Reboot, press ESC for ROMMON
2. Issue `password_reset`
3. `boot` the device
4. Login with default `admin / Admin123`

### 7.14.4 Software Upgrade

```cisco
! Copy new image to flash
copy tftp:\\1.1.1.1\asa9x.bin flash:

! Set boot image
boot system flash:/asa9x.bin

! Optionally update ASDM
copy tftp:\\1.1.1.1\asdm-7x.bin flash:
asdm image flash:/asdm-7x.bin

! Reload
reload
```

### 7.14.5 Key Show Commands Summary

```cisco
! System information
show version
show flash
show file system
show clock

! Interfaces
show interface ip brief
show ip address
show running-config interface

! Routing
show route

! NAT
show nat
show xlate
show running-config nat
show running-config object

! ACLs
show access-list
show running-config access-list
show running-config access-group

! Connections
show conn
show conn count

! Failover
show failover

! MPF
show service-policy
show running-config policy-map
show running-config class-map

! DHCP
show running-config dhcpd
show dhcpd binding

! VPN
show crypto ikev2 sa
show crypto ipsec sa
show vpn-sessiondb anyconnect

! General
show running-config
show startup-config
```

---

## 7.15 Summary of Key Concepts for the Oral Exam

> **Oral Exam Tip:** Be prepared to explain the following core concepts clearly and concisely:

1. **What is the ASA?** A dedicated stateful firewall appliance with VPN, NAT, and application inspection capabilities. It is NOT just a router with ACLs.

2. **Security Levels:** Range 0-100. Traffic from higher to lower is allowed by default; lower to higher is denied. Same-level is denied unless explicitly permitted.

3. **Stateful Inspection:** The ASA tracks connections in a state table. Return traffic for established connections is automatically permitted without explicit ACLs.

4. **NAT on ASA:** Uses network objects (since v8.3). Three types: static (1:1), dynamic (many:many), dynamic PAT (many:1). Object NAT vs. Twice NAT. Three processing sections.

5. **ASA ACLs vs. IOS ACLs:** ASA uses subnet masks (not wildcards), named only (no numbered), and works alongside security levels.

6. **MPF:** Three-tier model: class-map (match), policy-map (action), service-policy (where). Default policy inspects common protocols but NOT ICMP.

7. **Failover:** Active/Standby (any mode) vs. Active/Active (multi-context only). Stateless loses connections; stateful preserves them. Requires same hardware, same software, dedicated failover link.

8. **DMZ:** An intermediate-security zone (e.g., level 70) hosting public-facing servers. Requires static NAT + ACL for outside access.


---

# 8. VPN Technologies

## 8.1 VPN Overview

A **Virtual Private Network (VPN)** creates a secure, encrypted connection over a public network (such as the Internet) to form a logical, private connection between two endpoints.

**VPN Benefits:**
- **Cost Savings** -- Eliminates the need for expensive dedicated WAN links (leased lines) between sites
- **Security** -- Data traveling through the public network is encrypted and authenticated
- **Scalability** -- New sites and remote users can be added easily without major infrastructure changes
- **Compatibility** -- Works over existing Internet infrastructure at multiple layers (L2, L3, L4, L7)

**Key concept -- "Virtual" and "Private":**
- **Virtual**: The traffic of the private network travels through a public network
- **Private/Secure**: The travelling data is secured using encryption, authentication, and integrity mechanisms

> **Oral Exam Tip:** When asked "What is a VPN?", always mention these three things: (1) it connects endpoints over a public network, (2) it creates a logical/virtual tunnel, and (3) it provides security services such as confidentiality, integrity, and authentication. Cost savings over leased lines is a key business benefit.

## 8.2 VPN Topologies

### 8.2.1 Site-to-Site VPN
- Connects **two or more LANs** (e.g., branch office to headquarters)
- End hosts send **normal IP packets** -- they are completely unaware of the VPN
- Traffic goes through a **VPN gateway** (router or firewall) at each site
- The gateway handles all encryption/decryption transparently

### 8.2.2 Remote-Access VPN
- A **client-server** connection model
- A **client application** (e.g., Cisco AnyConnect) is required on the user's device
- Individual users (mobile workers, telecommuters) connect to a corporate VPN gateway
- The user's device encrypts traffic before sending it over the Internet

> **Oral Exam Tip:** Be able to clearly distinguish site-to-site from remote-access. Site-to-site is gateway-to-gateway (hosts are unaware); remote-access is client-to-gateway (client software is required on user device).

## 8.3 Tunneling Concept

**Tunneling** is a mechanism used to carry one protocol (the "passenger") inside another protocol (the "carrier") across a network that normally would not support the passenger protocol.

- A **delivery header** is added in front of the original payload to get it to the destination tunnel endpoint
- The tunnel **hides the infrastructure** below it
- The tunnel **decreases the apparent hop count** -- intermediate routers only see the outer header

### 8.3.1 Tunneling Protocol Comparison

| Protocol | Authentication | Encryption | Integrity | Notes |
|----------|---------------|------------|-----------|-------|
| **GRE** | None | None | None | Encapsulation only; no security |
| **L2TP** | User authentication | None | None | Needs IPsec for encryption |
| **IPsec** | Device authentication | Yes | Yes | Does NOT authenticate users |
| **SSL/TLS** | User + server auth | Yes | Yes | Application-layer; used for remote access VPNs |

## 8.4 GRE Tunneling

### 8.4.1 What is GRE?

**GRE (Generic Routing Encapsulation)** is a general-purpose tunneling protocol:
- Supports **multiprotocol tunneling** -- can encapsulate IP, IPv6, PPP, Frame-Relay, and other packet types inside an IP tunnel
- Supports **IP multicast tunneling** -- routing protocols (OSPF, EIGRP) can run over the tunnel, enabling dynamic routing across the virtual network
- **Does NOT provide encryption** -- if confidentiality is needed, IPsec must be configured on top of GRE
- Protocol number: **47**

### 8.4.2 GRE Tunnel Configuration (Full CLI)

**Topology:** WEST router (LAN: 172.16.1.0/24) --- ISP --- EAST router (LAN: 172.16.2.0/24)
- WEST S0/0/0: 10.1.1.1/30 -- ISP S0/0/0: 10.1.1.2/30
- ISP S0/0/1: 10.2.2.2/30 -- EAST S0/0/1: 10.2.2.1/30
- Tunnel0 addresses: WEST 172.16.12.1/30, EAST 172.16.12.2/30

**Step 1: Configure default routes to ISP**

```cisco
! WEST router
WEST(config)# ip route 0.0.0.0 0.0.0.0 10.1.1.2

! EAST router
EAST(config)# ip route 0.0.0.0 0.0.0.0 10.2.2.2
```

**Step 2: Configure GRE Tunnel on WEST**

```cisco
WEST(config)# interface tunnel 0
WEST(config-if)# ip address 172.16.12.1 255.255.255.252
WEST(config-if)# tunnel source s0/0/0
WEST(config-if)# tunnel destination 10.2.2.1
```

**Step 3: Configure GRE Tunnel on EAST**

```cisco
EAST(config)# interface tunnel 0
EAST(config-if)# ip address 172.16.12.2 255.255.255.252
EAST(config-if)# tunnel source 10.2.2.1
EAST(config-if)# tunnel destination 10.1.1.1
```

**Step 4: Enable OSPF routing over the tunnel**

```cisco
! WEST router
WEST(config)# router ospf 1
WEST(config-router)# network 172.16.1.0 0.0.0.255 area 0
WEST(config-router)# network 172.16.12.0 0.0.0.3 area 0

! EAST router
EAST(config)# router ospf 1
EAST(config-router)# network 172.16.2.0 0.0.0.255 area 0
EAST(config-router)# network 172.16.12.0 0.0.0.3 area 0
```

**Key points:**
- The `tunnel source` can be an interface name or an IP address
- The `tunnel destination` is the public IP of the remote tunnel endpoint
- OSPF network statements include the **tunnel subnet** (172.16.12.0/30), NOT the serial interface subnets
- The ISP router has **no knowledge** of the GRE tunnel

### 8.4.3 GRE Verification Commands

```cisco
! Verify tunnel interface status
WEST# show ip interface brief

! Verify tunnel details (protocol, source, destination, MTU)
WEST# show interfaces tunnel 0

! Verify OSPF learned routes through the tunnel
WEST# show ip route

! Ping across the tunnel
WEST# ping 172.16.12.2

! Trace the path (should go directly through tunnel)
WEST# traceroute 172.16.12.2
```

> **Oral Exam Tip:** The key limitation of GRE is that it provides **NO security** (no encryption, no authentication, no integrity). To secure a GRE tunnel, you must combine it with IPsec. Also, GRE's advantage over IPsec alone is that GRE can carry **multicast traffic** (routing protocols), while native IPsec cannot.

## 8.5 Cryptography Basics

### 8.5.1 Hash Functions

A **hash function** takes a binary input (message) of arbitrary length and produces a fixed-length output called a **hash value** (digest, digital fingerprint).

**Properties:**
- **One-way**: Easy to compute the hash from input, but practically impossible to reverse
- **Fixed output length**: Regardless of input size
- **Deterministic**: Same input always produces same output

**Purpose:** Data integrity and authentication

**Common hash algorithms:**
| Algorithm | Output Size | Status |
|-----------|------------|--------|
| **MD5** (Message Digest 5) | 128 bits | Considered weak; deprecated for security |
| **SHA-1** (Secure Hash Algorithm 1) | 160 bits | Deprecated; collision attacks found |
| **SHA-2** family | 224, 256, 384, or 512 bits | Currently recommended |
| **SHA-3** (NIST) | 224-512 bits | Newest standard |

**Limitation of plain hashing:** A hash alone only protects against accidental data corruption (transmission errors). It does **NOT** protect against **man-in-the-middle attacks** -- if the attacker knows the hash function, they can modify the message, recompute the hash, and attach the new hash.

### 8.5.2 HMAC (Keyed-Hash Message Authentication Code)

**HMAC** solves the man-in-the-middle problem by incorporating a **secret key** into the hash computation.

**How HMAC works:**
1. Sender combines the message with a **shared secret key**
2. The combined data is processed through a hash function (e.g., HMAC-MD5, HMAC-SHA)
3. The resulting HMAC digest is attached to the message
4. Receiver uses the same secret key and hash function to compute the HMAC
5. If the received HMAC matches the computed HMAC, both **integrity** and **authenticity** are verified

> **Oral Exam Tip:** The critical difference between a plain hash and HMAC is the **shared secret key**. Without knowing the key, an attacker cannot forge a valid HMAC, even if they modify the message.

### 8.5.3 Symmetric Encryption

- **Same key** is used for both encryption and decryption
- Fast and efficient for bulk data encryption
- Challenge: How to securely distribute the shared key?
- Examples: **DES** (56-bit, obsolete), **3DES** (168-bit), **AES** (128/192/256-bit, current standard)

### 8.5.4 Asymmetric Encryption

- Uses a **key pair**: public key + private key
- What is encrypted with the public key can only be decrypted with the matching private key (and vice versa)
- Slower than symmetric encryption; used for key exchange and digital signatures
- **Public key encryption = Confidentiality**: Encrypt with recipient's public key; only the recipient can decrypt with their private key
- **Private key signing = Authenticity**: Sign with sender's private key; anyone can verify with sender's public key
- Examples: **RSA**, **Diffie-Hellman** (key exchange only), **ECDSA**

**Protocols using asymmetric algorithms:**
- Internet Key Exchange (IKE)
- Secure Socket Layer (SSL) / TLS
- Secure Shell (SSH)
- Pretty Good Privacy (PGP)

### 8.5.5 Diffie-Hellman Key Exchange

**Diffie-Hellman (DH)** allows two parties to establish a shared secret key over an insecure channel without having previously shared secret information.

- Each party generates a private value and a public value
- Public values are exchanged
- Both parties independently compute the same shared secret
- The shared secret is never transmitted across the network

**DH Groups** (higher number = stronger but slower):
| Group | Key Size |
|-------|----------|
| DH 1 | 768 bits (legacy, insecure) |
| DH 2 | 1024 bits (legacy) |
| DH 5 | 1536 bits |
| DH 14 | 2048 bits (recommended minimum) |
| DH 15 | 3072 bits |
| DH 16 | 4096 bits |

## 8.6 IPsec Framework

**IPsec** is an open standards framework that provides secure transmission of sensitive information over unprotected networks. It acts at the **network layer (Layer 3)** and protects/authenticates IP packets between participating IPsec devices (peers).

### 8.6.1 IPsec Security Services

| Service | Purpose | Mechanisms |
|---------|---------|-----------|
| **Confidentiality** | Encrypt data so eavesdroppers cannot read it | DES, 3DES, AES, SEAL |
| **Integrity** | Ensure data has not been tampered with in transit | MD5, SHA-1, SHA-256 |
| **Authentication** | Verify the identity of the peer device | Pre-shared keys (PSK), RSA signatures, digital certificates |
| **Key Exchange** | Securely establish shared keys | Diffie-Hellman (DH1, DH2, DH5, DH14, DH15, DH16) |

> **Oral Exam Tip:** Remember the four pillars of IPsec: Confidentiality, Integrity, Authentication, Key Exchange. For each, you should be able to name at least two algorithms/methods.

### 8.6.2 IPsec Protocols: AH vs ESP

#### AH (Authentication Header) -- Protocol 51

- Provides: **Authentication** and **Integrity**
- Does **NOT** provide: **Encryption** (traffic is unencrypted / public)
- Authenticates the **entire packet** (including the outer IP header)
- Use case: When data publicity is acceptable but origin verification is critical (e.g., company website content)
- AH header fields:
  - **Next Header**: Identifies the header following AH
  - **SPI (Security Parameter Index)**: Tells receiver how to interpret the packet (which algorithms and keys to use)
  - **MAC**: Hash value calculated over the entire packet

#### ESP (Encapsulating Security Payload) -- Protocol 50

- Provides: **Encryption**, **Authentication**, **Integrity**, **Anti-replay**
- Authentication and integrity apply only to the **ESP data and payload** (NOT the outer IP header)
- ESP header fields:
  - **SPI**: Same function as in AH
  - **Sequence Number**: For anti-replay protection
  - **MAC**: Optional authentication field

**AH vs ESP Comparison:**

| Feature | AH | ESP |
|---------|-----|-----|
| Encryption | No | Yes |
| Authentication | Yes (entire packet) | Yes (ESP header + payload only) |
| Integrity | Yes (entire packet) | Yes (ESP header + payload only) |
| Anti-replay | No | Yes |
| IP Protocol | 51 | 50 |
| Most commonly used | No | Yes |

> **Oral Exam Tip:** ESP is far more commonly used because it provides encryption. AH is used in special cases where encryption is not needed (e.g., when encryption is handled at another layer, or when you need authentication of the outer IP header). The key difference in authentication scope: AH authenticates the ENTIRE packet including the IP header; ESP only authenticates the ESP header and payload.

### 8.6.3 IPsec Modes of Operation

#### Transport Mode
- Encrypts/authenticates only the **payload** of the original IP packet
- The **original IP header is preserved** (not encrypted)
- Typically used for **host-to-host** communication
- Lower overhead (no additional IP header)

#### Tunnel Mode
- Encrypts/authenticates the **entire original IP packet**
- A **new IP header** is prepended for routing through the tunnel
- Typically used for **gateway-to-gateway** (site-to-site) communication
- The original IP header is hidden inside the encrypted payload

> **Oral Exam Tip:** Tunnel mode is the default and most common mode for site-to-site VPNs because it hides the original source and destination addresses. Transport mode is used when the original IP addresses do not need to be hidden (e.g., host-to-host within a trusted network).

### 8.6.4 Security Associations (SA)

A **Security Association (SA)** is the basic building block of IPsec:
- An SA is a **single, one-way connection** -- for bidirectional (duplex) communication, **two SAs** are needed
- SAs are maintained within a **SA Database (SADB)** on each device
- An SA defines the **operating modes, algorithms, and keys** used for the connection
- VPN devices have SA entries for both **IPsec encryption parameters** and **IKE key exchange parameters**

## 8.7 IKE (Internet Key Exchange) Phases

### 8.7.1 IKE Phase 1

**Purpose:** Establish a secure, authenticated channel (IKE SA) between the two peers for IKE Phase 2 negotiation.

**What is negotiated:**
1. **IKE policy set** -- encryption algorithm (e.g., AES 256), hash algorithm (e.g., SHA), authentication method (e.g., pre-shared key), DH group (e.g., group 14), lifetime
2. **Diffie-Hellman key exchange** -- peers generate and exchange public DH values to create a shared secret
3. **Peer identity verification** -- authenticate the peer using the agreed method (PSK or certificates)

**Result:** An **IKE Security Association** (a.k.a. ISAKMP SA) -- a bidirectional secure management channel.

### 8.7.2 IKE Phase 2

**Purpose:** Negotiate the IPsec parameters and establish the IPsec tunnel for actual data traffic.

**What is negotiated:**
- **IPsec policy** (transform set): which encryption and hash algorithms to use for data traffic
- **IPsec SA**: the parameters for encrypting/authenticating user data
- **Perfect Forward Secrecy (PFS)**: optional; generates new DH keys for Phase 2 (ensures compromise of one session does not affect others)

**Result:** Two **IPsec Security Associations** (one for each direction) forming the IPsec tunnel.

### 8.7.3 IPsec Operation Summary

1. Host A sends **"interesting" traffic** (traffic matching the ACL) to Host B
2. R1 and R2 negotiate **IKE Phase 1** -- authenticate each other, establish IKE SA (secure channel)
3. R1 and R2 negotiate **IKE Phase 2** -- negotiate IPsec parameters, establish IPsec SAs (tunnel)
4. The **IPsec tunnel is ready** -- data communication starts, encrypted and authenticated
5. When the session ends or the SA lifetime expires, the **IPsec tunnel is terminated**

> **Oral Exam Tip:** IKE Phase 1 = "negotiation about how to negotiate" (builds the management tunnel). IKE Phase 2 = "negotiation about how to protect data" (builds the data tunnel). Know what each phase negotiates. SAs are NOT established until "interesting traffic" (matching the crypto ACL) is generated.

## 8.8 Site-to-Site IPsec VPN Configuration (6 Steps with Full CLI)

**Topology:** R1 (LAN: 192.168.1.0/24) --- R2 (pass-through) --- R3 (LAN: 192.168.3.0/24)
- R1 S0/0/0: 10.1.1.1 -- R2 S0/0/0: 10.1.1.2
- R2 S0/0/1: 10.2.2.2 -- R3 S0/0/1: 10.2.2.1

### Step 1: Enable IKE (ISAKMP)

```cisco
R1(config)# crypto isakmp enable
R3(config)# crypto isakmp enable
```

*IKE is enabled by default on IOS images with cryptographic feature sets.*

### Step 2: Configure IKE Phase 1 Policy (ISAKMP Policy)

```cisco
R1(config)# crypto isakmp policy 10
R1(config-isakmp)# encryption aes 256
R1(config-isakmp)# hash sha
R1(config-isakmp)# authentication pre-share
R1(config-isakmp)# group 14
R1(config-isakmp)# lifetime 3600
R1(config-isakmp)# end
```

*Configure the same policy on R3:*

```cisco
R3(config)# crypto isakmp policy 10
R3(config-isakmp)# encryption aes 256
R3(config-isakmp)# hash sha
R3(config-isakmp)# authentication pre-share
R3(config-isakmp)# group 14
R3(config-isakmp)# lifetime 3600
R3(config-isakmp)# end
```

**Parameters explained:**
- `encryption aes 256` -- IKE encryption algorithm (AES with 256-bit keys)
- `hash sha` -- IKE hash algorithm (SHA) for data integrity
- `authentication pre-share` -- authentication using pre-shared keys
- `group 14` -- Diffie-Hellman group 14 (2048-bit)
- `lifetime 3600` -- IKE SA lifetime in seconds (1 hour)

### Step 3: Configure Pre-Shared Keys

```cisco
! On R1 - point to R3's public interface
R1(config)# crypto isakmp key cisco123 address 10.2.2.1

! On R3 - point to R1's public interface
R3(config)# crypto isakmp key cisco123 address 10.1.1.1
```

*The key must match on both sides. The address is the remote VPN endpoint's public IP.*

### Step 4: Configure IPsec Transform Set (IKE Phase 2 Parameters)

```cisco
! On R1
R1(config)# crypto ipsec transform-set 50 esp-aes 256 esp-sha-hmac
R1(cfg-crypto-trans)# exit

! On R3
R3(config)# crypto ipsec transform-set 50 esp-aes 256 esp-sha-hmac
R3(cfg-crypto-trans)# exit
```

*Optionally set the IPsec SA lifetime:*

```cisco
R1(config)# crypto ipsec security-association lifetime seconds 1800
R3(config)# crypto ipsec security-association lifetime seconds 1800
```

**The transform set defines the Phase 2 algorithms:**
- `esp-aes 256` -- ESP encryption with AES-256
- `esp-sha-hmac` -- ESP integrity with SHA HMAC

### Step 5: Define Interesting Traffic (Crypto ACL)

```cisco
! On R1 - traffic from R1's LAN to R3's LAN
R1(config)# access-list 101 permit ip 192.168.1.0 0.0.0.255 192.168.3.0 0.0.0.255

! On R3 - traffic from R3's LAN to R1's LAN (mirrored)
R3(config)# access-list 101 permit ip 192.168.3.0 0.0.0.255 192.168.1.0 0.0.0.255
```

**Important:** Traffic **permitted** by this ACL is encrypted. Traffic **denied** is NOT dropped -- it is sent **unencrypted**. The ACLs on both ends must **mirror** each other.

### Step 6: Create and Apply Crypto Map

```cisco
! On R1
R1(config)# crypto map CMAP 10 ipsec-isakmp
R1(config-crypto-map)# match address 101
R1(config-crypto-map)# set peer 10.2.2.1
R1(config-crypto-map)# set pfs group14
R1(config-crypto-map)# set transform-set 50
R1(config-crypto-map)# set security-association lifetime seconds 900
R1(config-crypto-map)# exit

! Apply to outbound interface
R1(config)# interface S0/0/0
R1(config-if)# crypto map CMAP
```

```cisco
! On R3 (mirrored)
R3(config)# crypto map CMAP 10 ipsec-isakmp
R3(config-crypto-map)# match address 101
R3(config-crypto-map)# set peer 10.1.1.1
R3(config-crypto-map)# set pfs group14
R3(config-crypto-map)# set transform-set 50
R3(config-crypto-map)# set security-association lifetime seconds 900
R3(config-crypto-map)# exit

! Apply to outbound interface
R3(config)# interface S0/0/1
R3(config-if)# crypto map CMAP
```

**Crypto map components:**
- `match address 101` -- which ACL defines interesting traffic
- `set peer 10.2.2.1` -- remote VPN endpoint IP
- `set pfs group14` -- Perfect Forward Secrecy using DH group 14
- `set transform-set 50` -- which transform set to use
- `set security-association lifetime seconds 900` -- IPsec SA lifetime

> **Oral Exam Tip:** Memorize the 6 steps: (1) Enable IKE, (2) Configure IKE Phase 1 policy, (3) Configure pre-shared keys, (4) Configure transform set, (5) Define interesting traffic ACL, (6) Create and apply crypto map. The SAs are NOT established until interesting traffic is generated.

### 8.8.1 IPsec VPN Verification Commands

```cisco
! Show IKE Phase 1 policies
R1# show crypto isakmp policy

! Show IPsec transform sets (Phase 2 settings)
R1# show crypto ipsec transform-set

! Show crypto map details
R1# show crypto map

! Show IKE SAs (Phase 1) -- shows QM_IDLE when established
R1# show crypto isakmp sa

! Show IPsec SAs (Phase 2) -- shows packet counters and SA details
R1# show crypto ipsec sa
```

**Key verification points:**
- `show crypto isakmp sa` should show state **QM_IDLE** and status **ACTIVE** after interesting traffic is generated
- `show crypto ipsec sa` should show non-zero values for `#pkts encaps`, `#pkts encrypt`, `#pkts digest`
- Before interesting traffic, these counters will be zero and no inbound/outbound SAs will be listed

## 8.9 IPsec on ASA (Cisco Adaptive Security Appliance)

### 8.9.1 IKEv1 vs IKEv2

| Feature | IKEv1 | IKEv2 |
|---------|-------|-------|
| Message exchanges | 6-9 messages (Phase 1 + Phase 2) | 4 messages (2 request/response pairs) |
| Authentication | Separate from SA setup | Combined with SA setup |
| NAT Traversal | Optional, requires configuration | Built-in support |
| Reliability | No built-in retry | Built-in reliability |
| EAP support | No | Yes |

### 8.9.2 Key ASA VPN Concepts

- **Tunnel Group**: A set of records that defines a specific VPN connection policy (pre-shared key, authentication method, connection parameters)
- **Crypto Map**: Similar to IOS -- binds the interesting traffic ACL, peer address, and transform set
- **Group Policy**: Defines attributes for users (timeouts, split tunneling, DNS settings)

## 8.10 SSL/TLS VPN

### 8.10.1 SSL (Secure Socket Layer) / TLS (Transport Layer Security)

**SSL** was originally developed by Netscape. **TLS** is the IETF standardized successor (TLS can be viewed as SSL v3.1).

**Key characteristics:**
- Operates on top of **TCP** (reliable end-to-end data transfer)
- Provides security features: confidentiality and integrity
- SSL is **not a single protocol** -- it consists of **two layers** of protocols:
  - **SSL Record Protocol** (lower layer): Fragmentation, compression, encryption, MAC
  - **Upper-layer protocols**: Handshake Protocol, Change Cipher Spec, Alert Protocol

### 8.10.2 SSL Concepts

**SSL Session:**
- Association between client and server
- Defines cryptographic parameters (created by the Handshake Protocol)
- Can be shared by **multiple connections**
- Avoids expensive re-negotiation of crypto parameters for each connection

**SSL Connection:**
- A transient, peer-to-peer, secure communication link
- Derived from an SSL session

**Session State Parameters:** Session ID, peer certificate, compression method, cipher spec (encryption + MAC algorithm), master secret, is resumable flag

**Connection State Parameters:** Random numbers (nonces), MAC secret (separate for client/server), encryption keys, initialization vector (for CBC mode)

### 8.10.3 SSL Handshake Protocol (4 Phases)

**Phase 1 -- Establish Security Capabilities:**
- **Client Hello**: Version, client random, session ID, supported cipher suites, compression methods
- **Server Hello**: Agreed version, server random, session ID, selected cipher suite, compression method

**Phase 2 -- Server Authentication and Key Exchange:**
- Server sends certificate
- Server key exchange (if needed, e.g., DH parameters)
- Certificate request (optional -- for client authentication)
- Server Hello Done

**Phase 3 -- Client Authentication and Key Exchange:**
- Client certificate (if requested)
- Client key exchange (pre-master secret)
- Certificate verify

**Phase 4 -- Finish:**
- Change Cipher Spec messages (activate new cipher suite)
- Finished messages (MAC over all handshake messages using master secret -- verifies handshake integrity)

**Master Secret Creation:**
- Two-stage: Pre-master secret is exchanged, then master secret (48 bytes) is derived from pre-master secret + random nonces

### 8.10.4 SSL/TLS VPN Types

- **Clientless SSL VPN**: Uses a web browser only; provides access to web-based applications, file shares
- **Full-tunnel SSL VPN (AnyConnect)**: Requires a client application; provides full network access similar to being on the corporate LAN

## 8.11 AnyConnect Remote Access VPN

**Cisco AnyConnect Secure Mobility Client:**
- Full-tunnel SSL/TLS VPN client
- Supports both SSL and IPsec (IKEv2)
- Provides full network access to corporate resources
- Can be pre-installed or downloaded from the ASA when user connects via web browser
- Supports split tunneling (only corporate-destined traffic goes through VPN)
- Supports multi-factor authentication, posture assessment, web security

> **Oral Exam Tip:** SSL/TLS VPNs are primarily used for **remote-access** scenarios because they work through firewalls and NAT (using TCP port 443). IPsec is primarily used for **site-to-site** VPNs. AnyConnect supports both protocols.

---

# 9. Layer 2 Security

## 9.1 Overview of Layer 2 Threats

Layer 2 (Data Link Layer) attacks target switches and the protocols that operate at this layer. Because Layer 2 is the foundation of network communication, compromising it can undermine all upper-layer security mechanisms. Key attacks include:

1. **CAM Table Overflow** (MAC flooding)
2. **STP Manipulation** (root bridge attack)
3. **DTP Attack** (trunk negotiation abuse)
4. **DHCP Starvation** and **DHCP Spoofing**
5. **ARP Spoofing/Poisoning**
6. **VLAN Hopping** (double tagging)

> **Oral Exam Tip:** The first line of defense at Layer 2 is restricting access: shutdown unused ports, port security, 802.1X authentication, DHCP snooping, and ACLs. The second line is protocol security: VTP security, disable DTP, routing protocol authentication, HSRP security.

## 9.2 CAM Table Overflow Attack

### 9.2.1 The Attack

The **CAM (Content Addressable Memory) table** stores MAC address-to-port mappings on a switch. The table has a **finite size**.

**Attack mechanism:**
1. The attacker runs an attack tool (e.g., **macof**) that floods the switch with thousands of Ethernet frames, each with a **random source MAC address**
2. The CAM table fills up completely
3. When the CAM table is full, the switch can no longer learn new MAC addresses
4. The switch starts operating like a **hub** -- it **floods all traffic** out of all ports
5. The attacker, connected to any port, can now **capture/sniff all traffic** on the VLAN

### 9.2.2 Countermeasure: Port Security

**Port Security** limits the number of MAC addresses that can be learned on a single switch port, preventing CAM table overflow.

**Configuration:**

```cisco
! Enter the interface
Switch(config)# interface FastEthernet 0/1

! The port MUST be an access port (not dynamic)
Switch(config-if)# switchport mode access

! Enable port security
Switch(config-if)# switchport port-security

! Set maximum number of MAC addresses allowed (default is 1)
Switch(config-if)# switchport port-security maximum 1

! Option 1: Manually configure a specific MAC address
Switch(config-if)# switchport port-security mac-address 0001.0001.0001

! Option 2: Dynamically learn and remember (sticky)
Switch(config-if)# switchport port-security mac-address sticky

! Set violation mode
Switch(config-if)# switchport port-security violation shutdown
```

### 9.2.3 Port Security Violation Modes

| Mode | Action on Violation | Port Status | Syslog Message | Violation Counter |
|------|-------------------|-------------|----------------|-------------------|
| **Protect** | Drops offending traffic silently | Stays up | No | No |
| **Restrict** | Drops offending traffic | Stays up | Yes | Yes (increments) |
| **Shutdown** | Puts port in **err-disabled** state | Goes down | Yes | Yes (increments) |

**Shutdown** is the **default** violation mode and the most secure. To recover a port from err-disabled state:

```cisco
Switch(config)# interface FastEthernet 0/1
Switch(config-if)# shutdown
Switch(config-if)# no shutdown
```

Or configure automatic err-disable recovery:

```cisco
Switch(config)# errdisable recovery cause psecure-violation
Switch(config)# errdisable recovery interval 300
```

### 9.2.4 Port Security Verification

```cisco
! Show port security status for all interfaces
Switch# show port-security

! Show detailed port security for a specific interface
Switch# show port-security interface FastEthernet 0/1

! Show learned secure MAC addresses
Switch# show port-security address
```

> **Oral Exam Tip:** Port security prevents both CAM table overflow attacks AND DHCP starvation attacks (because starvation also relies on spoofed MAC addresses). Always remember: port security requires the port to be in **access mode** (not trunk/dynamic). Know the three violation modes and their behaviors.

## 9.3 STP Attacks and Countermeasures

### 9.3.1 The Root Bridge Manipulation Attack

**Spanning Tree Protocol (STP)** prevents Layer 2 loops by electing a **root bridge** -- the switch with the lowest bridge priority (or lowest MAC address as tiebreaker). Most traffic traverses the root bridge.

**Attack mechanism:**
1. An attacker connects a rogue switch to the network
2. The attacker configures this switch with a **very low STP priority** (e.g., 0 or 4096)
3. The rogue switch sends superior **BPDUs** (Bridge Protocol Data Units) and gets elected as the **new root bridge**
4. Network topology reconverges -- most traffic now flows through the attacker's switch
5. The attacker can now **sniff, modify, or drop** the traffic

**Why this is dangerous:** The root bridge has a special role; most of the traffic traverses it. An attacker who becomes root can see and manipulate most network traffic.

### 9.3.2 Countermeasures

#### BPDU Guard

**BPDU Guard** protects PortFast-enabled ports (end-user/access ports). If a BPDU is received on a BPDU Guard-enabled port, the port is immediately **put into err-disabled state**.

```cisco
! Enable PortFast on an access port
Switch(config-if)# spanning-tree portfast

! Enable BPDU Guard on that port
Switch(config-if)# spanning-tree bpduguard enable

! Or enable BPDU Guard globally on all PortFast ports
Switch(config)# spanning-tree portfast bpduguard default
```

**Apply to:** All end-user (access) ports. Prevents rogue switches from being connected.

#### Root Guard

**Root Guard** prevents a port from becoming a root port. If a root-guard-enabled port receives **superior BPDUs** (BPDUs from a switch claiming to be a better root), the port is moved to a **root-inconsistent state** (similar to listening state) and stops forwarding.

```cisco
Switch(config-if)# spanning-tree guard root
```

**Apply to:** All ports that connect to switches that should **never** become the root bridge (e.g., ports facing distribution/access layer switches).

#### Loop Guard

**Loop Guard** provides additional protection against Layer 2 loops. If BPDUs stop being received on a non-designated port (which could indicate a unidirectional link failure), the port transitions to a **loop-inconsistent blocking state** instead of forwarding.

```cisco
Switch(config-if)# spanning-tree guard loop
```

**Apply to:** All ports that are or can become non-designated ports.

### 9.3.3 STP Security Verification

```cisco
! Show spanning tree details
Switch# show spanning-tree

! Show spanning tree for a specific VLAN
Switch# show spanning-tree vlan 1

! Show spanning tree interface details
Switch# show spanning-tree interface FastEthernet 0/1 detail
```

> **Oral Exam Tip:** BPDU Guard is for **access ports** (where end devices connect) -- it shuts down the port if any BPDU is received. Root Guard is for **switch-to-switch ports** where the connected switch should never become root -- it blocks superior BPDUs without shutting down the port. These serve different purposes and are applied to different types of ports.

## 9.4 DTP Attacks and Countermeasures

### 9.4.1 The Attack

**DTP (Dynamic Trunking Protocol)** is a Cisco proprietary protocol that automatically negotiates trunk links between switches. **By default, DTP is enabled on all switch ports** (mode `dynamic auto` or `dynamic desirable`).

**Attack mechanism:**
1. An attacker connects to a switch port that has DTP enabled (default)
2. The attacker sends DTP negotiation frames to form a **trunk** link
3. Once a trunk is established, the attacker can:
   - Send and receive traffic on **all VLANs** (VLAN hopping)
   - Use **VTP** to propagate malicious VLAN changes
   - Perform **double-tagging attacks** to reach VLANs they should not access

### 9.4.2 VLAN Hopping -- Double Tagging Attack

1. Attacker sends a frame with **two 802.1Q tags**: the outer tag matches the native VLAN, the inner tag is the target VLAN
2. The first switch strips the outer tag (native VLAN) and forwards the frame with the inner tag
3. The second switch reads the inner tag and forwards the frame to the target VLAN
4. The attacker reaches a VLAN they are not a member of

### 9.4.3 Countermeasures

```cisco
! On ACCESS ports: explicitly set the port to access mode (disables DTP)
Switch(config-if)# switchport mode access

! On TRUNK ports: explicitly set trunk mode and disable DTP negotiation
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport nonegotiate

! Change native VLAN to an unused VLAN (prevents double-tagging)
Switch(config-if)# switchport trunk native vlan 999

! Shutdown all unused ports and assign them to an unused VLAN
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 999
Switch(config-if)# shutdown
```

### 9.4.4 DTP Verification

```cisco
! Show DTP status on an interface
Switch# show dtp interface FastEthernet 0/1

! Show interface switchport details
Switch# show interfaces FastEthernet 0/1 switchport

! Show trunk ports
Switch# show interfaces trunk
```

> **Oral Exam Tip:** The golden rule for DTP defense: **Never leave a port in dynamic mode.** Explicitly set every port to either `access` or `trunk`. Use `switchport nonegotiate` on trunk ports. Change the native VLAN away from VLAN 1. Shutdown unused ports.

## 9.5 VTP (VLAN Trunking Protocol) Concepts and Security

### 9.5.1 What is VTP?

**VTP** is a Cisco-proprietary protocol that automates the propagation of VLAN information between switches via trunk links. It minimizes misconfigurations and configuration inconsistencies.

**Key characteristics:**
- VTP messages are sent via Layer 2 multicast on **VLAN 1**
- **VTP domains** define sets of interconnected switches sharing the same VLAN configuration
- VTP does NOT configure switch ports for VLAN membership -- it only propagates VLAN database changes

### 9.5.2 VTP Modes

| Mode | Create/Delete VLANs | Forward VTP | Synchronize VLAN DB | Save to NVRAM |
|------|---------------------|-------------|---------------------|---------------|
| **Server** | Yes | Yes | Yes | Yes |
| **Client** | No | Yes | Yes | No |
| **Transparent** | Yes (local only) | Yes (forwards, does not process) | No | Yes |

### 9.5.3 VTP Message Types

- **Summary Advertisements**: Sent every 5 minutes; contain domain name and configuration revision number
- **Subset Advertisements**: Follow summary ads after a VLAN change; contain VLAN information
- **Advertisement Requests**: Sent when a switch resets, domain name changes, or a higher revision number is received

### 9.5.4 VTP Attack

If DTP is enabled and VTP domain is not configured:
1. Attacker connects a switch, DTP forms a trunk automatically
2. Attacker sets a VTP domain name on their switch
3. This domain name propagates to all other switches (because they had no domain set)
4. Attacker becomes part of the VTP domain as a server
5. Attacker can **delete VLANs** (e.g., `no vlan 10`) and the deletion propagates to all switches
6. All ports in the deleted VLAN lose connectivity

### 9.5.5 VTP Countermeasures

```cisco
! Option 1: Set VTP mode to transparent on all switches (prevents synchronization)
Switch(config)# vtp mode transparent

! Option 2: Configure VTP authentication (password must match across all switches)
Switch(config)# vtp password MySecurePassword

! Always disable DTP on all ports
Switch(config-if)# switchport nonegotiate
```

### 9.5.6 VTP Configuration and Verification

```cisco
! Configure VTP
Switch(config)# vtp mode server
Switch(config)# vtp domain MyDomain
Switch(config)# vtp version 2
Switch(config)# vtp password MyPassword
Switch(config)# vtp pruning

! Verify VTP status
Switch# show vtp status

! Verify VTP counters
Switch# show vtp counters
```

> **Oral Exam Tip:** The VTP attack only works when (1) DTP is left enabled (default) so a trunk can be formed, and (2) no VTP domain name was previously configured, allowing the attacker to set one. Defense: disable DTP (`switchport nonegotiate`), use VTP transparent mode, or configure VTP authentication with a password.

## 9.6 DHCP Attacks

### 9.6.1 DHCP Starvation Attack

**Attack mechanism:**
1. Attacker generates thousands of DHCP requests using **spoofed MAC addresses**
2. Each request gets an IP address from the DHCP pool
3. The DHCP pool is **exhausted** -- no IP addresses remain for legitimate clients
4. New legitimate clients cannot obtain IP addresses

**Countermeasure:** **Port Security** with `maximum 1` MAC address per port prevents the attacker from using multiple spoofed MAC addresses.

### 9.6.2 DHCP Spoofing (Rogue DHCP Server) Attack

**Attack mechanism:**
1. Attacker places a **fake DHCP server** on the network
2. When a client sends a DHCP Discover (broadcast), **both** the legitimate and fake servers respond
3. Because the fake server is typically **closer** to the client, its DHCP Offer arrives first
4. The client accepts the fake server's offer, receiving:
   - A fake **default gateway** (attacker's machine -- enabling man-in-the-middle)
   - A fake **DNS server** (redirecting web traffic to malicious sites)

### 9.6.3 Countermeasure: DHCP Snooping

**DHCP Snooping** is a Layer 2 security feature that filters untrusted DHCP messages and builds a **DHCP Snooping Binding Table**.

**Trust model:**
- **Trusted ports**: Ports connected to legitimate DHCP servers (or uplink to routers/other switches)
- **Untrusted ports**: All other ports (default) -- DHCP server messages (Offer, ACK) are dropped

**Configuration:**

```cisco
! Enable DHCP snooping globally
Switch(config)# ip dhcp snooping

! Enable DHCP snooping for specific VLANs
Switch(config)# ip dhcp snooping vlan 1
Switch(config)# ip dhcp snooping vlan 10

! Configure trusted ports (connected to legitimate DHCP server)
Switch(config)# interface FastEthernet 0/24
Switch(config-if)# ip dhcp snooping trust

! Configure rate limiting on untrusted ports (prevent starvation)
Switch(config)# interface FastEthernet 0/1
Switch(config-if)# ip dhcp snooping limit rate 10
```

### 9.6.4 DHCP Snooping Binding Table

The binding table is built by "snooping" DHCP replies and maps:
- **MAC address** to **IP address** to **VLAN** to **Interface** to **Lease time**

```cisco
! View the DHCP snooping binding table
Switch# show ip dhcp snooping binding

! Example output:
! MacAddress          IpAddress       Lease(sec)  Type           VLAN  Interface
! 00:03:47:B5:9F:AD  10.120.4.10     193185      dhcp-snooping  4     Fa3/18
```

**The binding table is also used by:**
- **Dynamic ARP Inspection (DAI)**: Validates ARP packets against the binding table
- **IP Source Guard (IPSG)**: Validates all IP traffic against the binding table

```cisco
! Save binding table to survive switch failure
Switch(config)# ip dhcp snooping database tftp://172.26.168.10/tftpboot/dhcpdb
Switch(config)# ip dhcp snooping database write-delay 60

! Enable DHCP option 82 for enhanced tracking
Switch(config)# ip dhcp snooping information option
```

### 9.6.5 DHCP Snooping Verification

```cisco
! Show DHCP snooping status
Switch# show ip dhcp snooping

! Show DHCP snooping binding table
Switch# show ip dhcp snooping binding

! Show DHCP snooping statistics
Switch# show ip dhcp snooping statistics
```

> **Oral Exam Tip:** DHCP Snooping is a foundational security feature because its binding table is used by both Dynamic ARP Inspection (DAI) and IP Source Guard (IPSG). Remember: trusted ports allow DHCP server messages; untrusted ports (default) block them. Rate limiting on untrusted ports also helps prevent DHCP starvation.

## 9.7 Related Layer 2 Security Features

### 9.7.1 Dynamic ARP Inspection (DAI)

- Prevents **ARP spoofing/poisoning** attacks
- Intercepts all ARP requests and responses on untrusted ports
- Uses the **DHCP Snooping Binding Table** to validate ARP packets
- If the ARP packet's MAC-IP mapping does not match the binding table, it is **dropped**
- Configured per VLAN; uses the same trust model as DHCP snooping

### 9.7.2 IP Source Guard (IPSG)

- Prevents **IP/MAC address spoofing**
- Operates on every packet (not just ARP like DAI)
- Uses the **DHCP Snooping Binding Table** to validate source IP and MAC
- If traffic from an interface does not match the binding table entry, it is **blocked**
- Deployed on untrusted Layer 2 access and trunk ports

### 9.7.3 Security Feature Summary

| Feature | Prevents | Uses Binding Table |
|---------|----------|--------------------|
| **Port Security** | CAM overflow, DHCP starvation | No (own MAC table) |
| **DHCP Snooping** | Rogue DHCP servers | Builds it |
| **Dynamic ARP Inspection** | ARP spoofing | Yes (reads it) |
| **IP Source Guard** | IP/MAC spoofing | Yes (reads it) |

## 9.8 Layer 2 Security Summary -- Defense in Depth

**First line of defense (restrict access):**
- Shutdown unused ports
- Port Security
- 802.1X Authentication
- DHCP Snooping
- ACLs

**Second line of defense (protocol security):**
- VTP Security (transparent mode or authentication)
- Disable DTP (switchport nonegotiate)
- BPDU Guard / Root Guard
- Routing Protocol Authentication

---

# 10. Cloud Security -- OpenStack

## 10.1 Cloud Computing Models

### 10.1.1 NIST Cloud Service Models

| Model | What Provider Manages | What Customer Manages | Examples |
|-------|----------------------|----------------------|----------|
| **IaaS** (Infrastructure as a Service) | Hardware, networking, storage, virtualization | OS, middleware, runtime, data, applications | OpenStack, AWS EC2, Azure VMs |
| **PaaS** (Platform as a Service) | IaaS + OS, middleware, runtime | Data, applications | Heroku, Google App Engine |
| **SaaS** (Software as a Service) | Everything | Just uses the application | Gmail, Office 365, Salesforce |

### 10.1.2 Cloud Deployment Models

- **Public Cloud**: Shared infrastructure, available to general public (AWS, Azure, GCP)
- **Private Cloud**: Dedicated infrastructure for a single organization (OpenStack on-premises)
- **Hybrid Cloud**: Combination of public and private clouds
- **Community Cloud**: Shared by organizations with common concerns

> **Oral Exam Tip:** OpenStack is primarily an **IaaS** platform that can be used to build **private clouds**. It provides more standardized services and feels like a public cloud inside an enterprise, offering more flexibility to users compared to traditional enterprise toolsets.

## 10.2 OpenStack Overview and Architecture

### 10.2.1 What is OpenStack?

OpenStack is an **open-source cloud computing platform** that provides IaaS. Used by major organizations including eBay, Alcatel-Lucent, BMW, PayPal, NASA, and Sony.

### 10.2.2 Core Components

| Service | Project Name | Function |
|---------|-------------|----------|
| **Identity** | Keystone | Authentication, authorization, service catalog |
| **Compute** | Nova | Virtual machine lifecycle management |
| **Networking** | Neutron | Software-defined networking (SDN) |
| **Image** | Glance | Virtual machine image storage and management |
| **Block Storage** | Cinder | Persistent block storage volumes |
| **Object Storage** | Swift | Scalable redundant object storage |
| **Dashboard** | Horizon | Web-based graphical user interface |
| **Orchestration** | Heat | Template-based resource orchestration |
| **Telemetry** | Ceilometer | Metering and monitoring |

### 10.2.3 Traditional OpenStack Architecture

A typical production OpenStack cloud consists of:

- **Controller Node**: The backbone of the cloud
  - **MariaDB** (MySQL fork): Relational database storing all service data
  - **RabbitMQ**: Message queue service (AMQP protocol) for inter-daemon communication
  - **API daemons**: All service APIs run here (primary gateway to each service)
  - **Horizon dashboard**: Runs under Apache web server

- **Network Node**: Contains Neutron daemons
  - DHCP services for instances
  - Layer 3 (routing) services
  - Network plugin agents
  - Metadata daemon

- **Compute Nodes**: The "muscle" of the cloud
  - Provide disk, CPU, memory resources consumed by instances
  - Each contains a Type-1 hypervisor
  - nova-compute daemon for hypervisor management
  - Neutron plugin agent for network connectivity

- **Block Storage Nodes**: Cinder volumes via LVM and iSCSI

- **Object Storage Nodes**: Swift object storage with data replication

> **Oral Exam Tip:** Know the role of each node type. Almost each OpenStack component has its **own database**. The key supporting infrastructure services are MariaDB (database) and RabbitMQ (message queue).

## 10.3 Keystone -- Identity Service

### 10.3.1 What Keystone Does

Keystone provides **identity and access management** for ALL components of OpenStack. It is the central authentication service -- receiving more requests than any other OpenStack service.

**Internal services:**
- Identity, Resource, Assignment, Token, Catalog, Policy

**Key functions:**
- All users and services must authenticate through Keystone
- Exposed as an HTTP frontend (Apache on port 5000)
- Supports **federation** and authentication with external systems (LDAP, Active Directory)
- The **policy service** allows granular control over actions by user/role

**Critical distinction:**
- **Authentication** = confirming identity ("proving who you are")
- **Authorization** = determining access rights ("what you can do") -- handled by `policy.json` in each service, NOT by Keystone directly

### 10.3.2 Keystone Concepts

#### Domains
- **High-level logical containers** for users, groups, and projects
- Used to segregate different customers/organizations in a multi-tenant cloud
- Each domain is independent -- users in different domains can have the same name (identified by UUID)
- Default domain: `Default` (created during OpenStack installation)

#### Projects (formerly "Tenants")
- Represent an **area where resources get created**
- Resources created in a project are **owned by that project**
- Users in other projects cannot see your resources unless explicitly shared
- A user can belong to **multiple projects** but can only be **authenticated (scoped) to one project at a time**
- Examples: accounting, finance, human-resources, development

#### Users
- Individual accounts created for people in an organization
- Stored in Keystone database (or external LDAP/Active Directory)
- Each domain can contain any number of users
- OpenStack **services** (Nova, Neutron, Glance) also have user accounts in a **"service" project** for inter-service authentication
- Keystone is the only service that does NOT have a user account (it does not authenticate against itself)

#### Groups
- Optional containers for users
- Provide an easy way to apply a role to **multiple users at once**
- Eliminate the hassle of applying roles one user at a time

#### Roles
- **Labels** applied to a user or group **on a specific project**
- Keystone does NOT handle authorization -- `policy.json` in each service defines what a role can do
- Common roles:
  - `admin` -- full administrative access to all projects in all domains
  - `_member_` -- regular operator rights (create, read, update, delete own resources)

#### Tokens
- Issued by Keystone upon successful authentication
- **Scoped to a project** -- any resource created with this token is owned by that project
- Include the user's role assignments
- Presented with every API request to other services

#### Service Catalog / Endpoints
- A **map stored in Keystone** listing all services and their API URLs
- Like a "phone book" for OpenStack services
- Three URL types for each service:
  - **Public**: External access URL (coffee shop, smartphone app)
  - **Internal**: URL for service-to-service communication within the OpenStack cluster
  - **Admin**: Admin-only features (often same as internal; Keystone uses port 35357 for admin)

#### Quotas
- Determine the **quantity or size** of resources within a project
- Act as **guardrails** preventing users from exceeding capacity
- Each service tracks its own quotas; Keystone dashboard provides easy adjustment
- Requires `admin` role to modify

### 10.3.3 Authentication Flow

1. User provides **Keystone URL, domain, project, username, password** (via Horizon, CLI, SDK, or API)
2. Keystone validates credentials
3. Keystone returns a **token** (scoped to the specified project) and the **service catalog**
4. User uses the token + service catalog to send API requests to the desired service
5. The target service validates the token with Keystone and checks `policy.json` for authorization
6. If authorized, the request is fulfilled

### 10.3.4 Federation

Keystone supports **federated identity** -- authentication through external identity providers (IdP):
- LDAP servers
- Active Directory
- SAML-based identity providers
- This allows organizations to use their existing identity infrastructure with OpenStack

### 10.3.5 Keystone CLI Commands

```cisco
! Source credentials
$ source openrc

! Issue/verify a token
$ openstack token issue

! User management
$ openstack user list
$ openstack user create --domain default --project trade --password openstack --email user@example.com newuser
$ openstack user show <user-name-or-id>
$ openstack user delete <user-name-or-id>

! Role management
$ openstack role list
$ openstack role add --user <username> --project <project> _member_
$ openstack role assignment list --names

! Project management
$ openstack project list
$ openstack project create --domain <domain> <project-name>
$ openstack project show <project-name-or-id>

! Domain management
$ openstack domain list
$ openstack domain create <domain-name>

! Group management
$ openstack group create --domain <domain> <group-name>
$ openstack group add user --group-domain <domain> <group> <user>
$ openstack group contains user --group-domain <domain> <group> <user>

! Quota management
$ openstack quota show <project-id>
$ openstack quota set --instances 20 <project-id>

! Service catalog
$ openstack catalog list
$ openstack service list
$ openstack endpoint list

! Add a new service and endpoints
$ openstack service create --name <name> --description "<desc>" <type>
$ openstack endpoint create --region RegionOne <service-type> public <url>
$ openstack endpoint create --region RegionOne <service-type> internal <url>
$ openstack endpoint create --region RegionOne <service-type> admin <url>
```

> **Oral Exam Tip:** Keystone provides **authentication**, not authorization. Authorization is handled by `policy.json` in each service. A user is always **scoped to one project** at a time -- resources they create are owned by that project. CLI arguments always take priority over Bash environment variables.

## 10.4 Nova -- Compute Service

### 10.4.1 What Nova Does

Nova is the **heart of the OpenStack cloud** -- it manages and automates pools of compute resources. It is a collection of daemons that orchestrate virtual machine lifecycle using existing virtualization technologies.

### 10.4.2 Nova Architecture Components

| Component | Function |
|-----------|----------|
| **nova-api** | Primary gateway to Nova; handles create, list, delete, manage instance requests |
| **nova-scheduler** | Evaluates and filters available compute hosts to determine the best node for a new instance |
| **nova-conductor** | "Database broker" -- connects to the relational database; because compute nodes are the **least trusted** component, all DB communication goes through conductor |
| **nova-novncproxy** | Provides serial console access to instances via VNC client or web browser |
| **nova-consoleauth** | Authorizes user tokens for VNC console access and maps host/port of instance's VNC server |
| **nova-compute** | Manages virtual machines directly on the hypervisor; runs on each compute node |

### 10.4.3 Supported Hypervisor Types

| Hypervisor | Year | Key Feature |
|-----------|------|-------------|
| **QEMU** (Quick Emulator) | 2003 | Full system emulation; no CPU assistance needed; slower |
| **QEMU-KVM** | 2006 | Fork of QEMU with hardware-assisted virtualization (HVM); near-native speeds |
| **Xen** | 2003 | Open source; uses paravirtualization (PV); used by AWS, Rackspace |
| **XenServer** | - | Commercial product built on Xen |
| **Hyper-V** | - | Microsoft hypervisor |
| **VMware ESXi/vCenter** | - | Enterprise virtualization |
| **LXC, Docker** | - | Linux container technologies |

**Libvirt** is an open-source API daemon used to manage hypervisors. `nova-compute` uses the Libvirt daemon (`libvirtd`) to manage VMs.

### 10.4.4 Flavors

A **flavor** defines the hardware profile for an instance:
- **ID**: UUID of the flavor
- **Name**: Human-readable name (e.g., m1.tiny, m1.small)
- **RAM**: Amount of RAM in megabytes
- **Disk**: Root partition size in gigabytes
- **VCPUs**: Number of virtual CPUs (default 16:1 overcommit ratio)
- **Ephemeral**: Secondary disk size
- **Swap**: Swap space size

Creating flavors requires the `admin` role (by default). Flavors are **public** by default (accessible to all projects) unless restricted to specific projects.

### 10.4.5 Key Pairs

SSH key pairs for passwordless instance access:
- Nova stores the **public key**; user keeps the **private key**
- Two options: (1) Nova generates the pair, or (2) user imports an existing public key
- Key pairs are owned by the **user** (not the project) -- deleting a user deletes their keys
- Selected at instance launch time; cloud-init places the public key in the instance

### 10.4.6 Instance Lifecycle / Actions

| Action | Description |
|--------|-------------|
| **Launch/Boot** | Create a new instance from an image + flavor |
| **Start** | Power on a stopped instance |
| **Shut Off** | Graceful shutdown (ACPI) |
| **Pause** | Store state in memory (RAM) |
| **Suspend** | Store state on disk |
| **Shelve** | Stop, snapshot, remove from compute node (frees resources) |
| **Resume/Unshelve** | Restore paused/suspended/shelved instance |
| **Soft Reboot** | Graceful reboot (ACPI) |
| **Hard Reboot** | Cold reboot (power off then on) |
| **Resize** | Change the flavor |
| **Rebuild** | Recreate from fresh image (keeps IPs and metadata) |
| **Snapshot** | Capture disk contents as a Glance image |
| **Lock/Unlock** | Prevent/allow modifications by non-admin users |
| **Associate Floating IP** | Map an external IP address |
| **Terminate/Delete** | Completely remove the instance |

### 10.4.7 Nova CLI Commands

```cisco
! Instance management
$ openstack server list
$ openstack server create --image cirros --flavor m1.tiny --key-name mykey --nic net-id=<network> myinstance
$ openstack server show <instance-name-or-id>
$ openstack server delete <instance-name-or-id>
$ openstack server start <instance>
$ openstack server stop <instance>
$ openstack server reboot <instance>
$ openstack server reboot --hard <instance>
$ openstack server pause <instance>
$ openstack server suspend <instance>
$ openstack server resize --flavor <new-flavor> <instance>

! Console access
$ openstack console log show <instance>
$ openstack console url show <instance>

! Snapshots
$ openstack server image create --name <snapshot-name> <instance>

! Key pair management
$ openstack keypair create <name> > <name>.pem
$ openstack keypair list
$ openstack keypair show <name>
$ openstack keypair delete <name>

! Flavor management (requires admin)
$ openstack flavor list
$ openstack flavor create --id <id> --vcpus <n> --ram <MB> --disk <GB> "<name>"
$ openstack flavor show <name-or-id>
$ openstack flavor delete <name-or-id>

! Hypervisor information
$ openstack hypervisor list
$ openstack hypervisor show <name>
```

> **Oral Exam Tip:** To boot an instance you need three things minimum: (1) a boot source (image), (2) a flavor, and (3) a network. Key pairs are owned by **users**, not projects. nova-conductor exists because compute nodes are the **least trusted** component (they should never have direct database access).

## 10.5 Neutron -- Networking Service

### 10.5.1 What Neutron Does

Neutron manages the OpenStack environment's **virtual networks, subnets, IP addresses, routers, firewall rules**, and more. It provides **Software Defined Networking (SDN)** capabilities.

### 10.5.2 Neutron Architecture Components

| Component | Function |
|-----------|----------|
| **neutron-server** | API and primary gateway; handles create, list, delete for all network resources |
| **neutron-dhcp-agent** | Provides DHCP services using `dnsmasq` within **network namespaces** |
| **neutron-l3-agent** | Creates routers (network namespaces with routing tables and `iptables` rules) |
| **neutron-metadata-agent** | Provides metadata services to instances (via 169.254.169.254) |
| **neutron-linuxbridge-agent** | Runs on each compute node; creates virtual network interfaces, Linux bridges, and `iptables` rules |

**Network namespaces** are a Linux kernel feature that partitions network resources, allowing segregation despite similar IP address ranges.

**LinuxBridge plugin** utilizes existing Linux kernel features:
- `neutron-dhcp-agent`: network namespaces + dnsmasq
- `neutron-l3-agent`: network namespaces + iptables (netfilter) + conntrack
- `neutron-plugin-agent`: iptables + iproute2 (gre, vlan, vxlan modules) + bridge-utils

### 10.5.3 Neutron Concepts

#### Networks

A **network** is analogous to a logical slice of the physical network (a Layer 2 broadcast domain).

**Two types:**
- **Tenant Network**: Created by regular users; provides a private virtual L2 domain; owned by the project
- **Provider Network**: Created by admins; provides access to resources **outside** OpenStack (e.g., the Internet, bare-metal servers); can use FLAT, VLAN, VXLAN, or GRE encapsulation

#### Subnets

- An **IPv4 or IPv6 address block** associated with a network
- Must be associated with a network to boot instances on it
- Specified in CIDR notation (e.g., 192.168.1.0/24)
- DHCP typically enabled for tenant subnets
- IP allocation within a Neutron subnet:
  - `.0` = network address
  - `.1` = reserved for router (gateway), even if no router exists yet
  - `.2` = DHCP server
  - `.3` to `.254` = instances and other resources
  - `.255` = broadcast

#### Ports

- Analogous to a **virtual network interface card (vNIC)**
- Entry/exit point for data traffic
- Has a MAC address and UUID
- Automatically created when an instance boots on a network
- Can be pre-created to reserve specific IP addresses

#### Security Groups and Rules

- Control **inbound (ingress)** and **outbound (egress)** traffic to/from a port
- Default security group: **all egress allowed, all ingress denied** (except from instances with the same default security group)
- Rules are **stateful** -- allowing ingress TCP/22 automatically allows the return traffic
- Multiple security groups can be applied to an instance; **most permissive rules win**
- Removing ALL security groups from a port **blocks all traffic** (ingress and egress)

#### Routers

- Virtual Layer 3 devices created by `neutron-l3-agent`
- Implemented as **network namespaces** with unique routing tables and iptables rules
- Connect different broadcast domains (subnets) together

#### East-West vs North-South Traffic

- **East-West traffic**: Communication between instances on **different tenant networks** (routed through a Neutron router)
- **North-South traffic**: Communication between instances and resources **outside** OpenStack (requires router gateway set to a provider network)

#### Floating IPs

- External, publicly routable IP addresses mapped to instances
- Similar to AWS Elastic IPs
- Two-step process: (1) Allocate floating IP to project from provider subnet pool, (2) Associate floating IP with an instance
- The floating IP pool is defined by the provider subnet's allocation range
- Can be disassociated and released back to the pool when no longer needed

### 10.5.4 Neutron CLI Commands

```cisco
! Network management
$ openstack network list
$ openstack network list --long
$ openstack network create <name>
$ openstack network create --provider-physical-network <label> --provider-network-type flat --external <name>
$ openstack network show <name-or-id>
$ openstack network delete <name-or-id>

! Subnet management
$ openstack subnet list
$ openstack subnet list --long
$ openstack subnet create --network <network> --subnet-range 192.168.1.0/24 <name>
$ openstack subnet create --network <net> --subnet-range 172.16.0.0/24 --gateway 172.16.0.1 --no-dhcp <name>
$ openstack subnet show <name-or-id>

! Router management
$ openstack router list
$ openstack router create <name>
$ openstack router add subnet <router> <subnet>
$ openstack router set <router> --external-gateway <provider-network>
$ openstack port list --router <router>

! Security group management
$ openstack security group list
$ openstack security group create <name>
$ openstack security group rule create --protocol tcp --ingress --dst-port 22 --src-ip 0.0.0.0/0 <sg-name>
$ openstack security group rule create --protocol icmp --ingress --src-ip 0.0.0.0/0 <sg-name>
$ openstack security group rule list <sg-name> --long

! Floating IP management
$ openstack floating ip create --floating-ip-address <ip> <provider-network>
$ openstack server add floating ip <instance> <floating-ip>
$ openstack server remove floating ip <instance> <floating-ip>
$ openstack floating ip delete <floating-ip>

! Port management
$ openstack port list
$ openstack port create --network <network> --fixed-ip subnet=<subnet>,ip-address=<ip> <name>

! Apply security group to instance
$ openstack server add security group <instance> <sg-name>
```

> **Oral Exam Tip:** For Neutron, remember: (1) Tenant networks are for internal use, provider networks connect to the outside. (2) Default security group blocks ALL ingress except from same security group. (3) East-west = between tenant networks; north-south = to/from outside (requires provider network). (4) Floating IPs require a provider network and a router with its gateway set to that provider network. (5) The exam focuses on operator-level tasks, NOT Neutron configuration files.

---

# 11. Monitoring and Management

## 11.1 Syslog

### 11.1.1 Overview

**Syslog** is a standard protocol and system for generating, collecting, and storing log messages from network devices.

- Developed in **1980** for UNIX systems
- Standardized in **RFC 3164**
- Security enhancements in **RFC 3195**
- The syslog protocol sends system messages and debug output to a local logging process
- Messages can be sent to an **external syslog server** across the network

### 11.1.2 Syslog Destinations

| Destination | Description |
|-------------|-------------|
| **Console line** | Messages displayed on the console (default) |
| **Terminal line** | Messages sent to VTY (Telnet/SSH) sessions |
| **Logging buffer** | Messages stored in RAM inside the device |
| **Syslog server** | Messages sent to an external server for centralized storage and analysis |

### 11.1.3 Syslog Severity Levels (0-7)

**Memorize this table -- it is extremely commonly asked:**

| Severity Level | Name | Description | Mnemonic |
|---------------|------|-------------|----------|
| **0** | Emergency | System is unusable | **E**very |
| **1** | Alert | Immediate action needed | **A**wesome |
| **2** | Critical | Critical condition | **C**isco |
| **3** | Error | Error condition | **E**ngineer |
| **4** | Warning | Warning condition | **W**ill |
| **5** | Notification | Normal but significant | **N**eed |
| **6** | Informational | Informational message | **I**ce |
| **7** | Debugging | Debugging message | **D**aily |

**Key principle:** Lower number = more severe. Setting a logging level includes all levels with **lower numbers** (more severe). For example, setting level 4 (Warning) logs levels 0-4.

### 11.1.4 Syslog Message Format

```
%facility-severity-MNEMONIC: description
```

**Example:**
```
%LINK-3-UPDOWN: Interface Port-channel1, changed state to up
```

- **Facility**: Service identifier (e.g., LINK, OSPF, SYS, IF, IPsec)
- **Severity**: Numeric severity level (0-7)
- **MNEMONIC**: Short code describing the event
- **Description**: Human-readable description

### 11.1.5 Syslog Configuration

```cisco
! Enable timestamps on log messages (CRITICAL for forensics)
R1(config)# service timestamps log datetime

! Set console logging level (default is debugging/level 7)
R1(config)# logging console warnings

! Set buffer logging level and size
R1(config)# logging buffered 16384 informational

! Configure remote syslog server
R1(config)# logging host 192.168.1.100

! Set the severity level for the syslog server
R1(config)# logging trap informational

! Set the syslog source interface
R1(config)# logging source-interface Loopback0

! Set the facility (for syslog server categorization)
R1(config)# logging facility local7
```

### 11.1.6 Syslog Security

The original syslog implementation is **UDP-based with no security**. RFC 3195 addresses this:
- **Reliable log delivery**: TCP-based transport
- **Transmission Confidentiality**: Use of TLS or SSH tunnels
- **Transmission Integrity and Authentication**: Use of message digest algorithms

### 11.1.7 Syslog Verification

```cisco
! Show logging configuration and recent buffered messages
R1# show logging

! Show logging to a specific destination
R1# show logging | include Syslog
```

> **Oral Exam Tip:** You MUST know the 8 severity levels (0-7) by heart. Remember: 0 = Emergency (most severe), 7 = Debugging (least severe). Always enable timestamps with `service timestamps log datetime` -- without timestamps, logs are useless for incident response. When asked about remote logging, mention that syslog uses **UDP port 514** by default and that TLS should be used for security.

## 11.2 SNMP (Simple Network Management Protocol)

### 11.2.1 Overview

**SNMP** is an application-layer protocol for monitoring and managing network devices. It provides a standardized message format for communication between managers and agents.

**SNMP System consists of three elements:**
1. **SNMP Manager (NMS)**: The network management station that polls agents and receives traps
2. **SNMP Agent**: Software running on managed devices that collects and stores local data
3. **MIB (Management Information Base)**: Database of managed objects (device data and operational statistics) stored on the agent

**Ports:**
- **UDP 161**: Manager polls agents (get/set requests)
- **UDP 162**: Agents send traps to manager

### 11.2.2 SNMP Operations

| Operation | Direction | Description |
|-----------|-----------|-------------|
| **get-request** | Manager -> Agent | Retrieves a value from a specific MIB variable |
| **get-next-request** | Manager -> Agent | Sequential search through a MIB table |
| **get-bulk-request** | Manager -> Agent | Retrieves large blocks of data (SNMPv2+) |
| **set-request** | Manager -> Agent | Stores/changes a value in a specific MIB variable (can also trigger actions like a router reboot) |
| **get-response** | Agent -> Manager | Reply to get/set requests |
| **trap** | Agent -> Manager | **Unsolicited** alert about a condition or event (e.g., interface down) |

**Key concept -- Traps:** Trap-directed notifications are **unsolicited** -- the agent sends them without being polled. This reduces network traffic and agent resources compared to constant polling.

### 11.2.3 SNMP Versions

| Version | Authentication | Encryption | Bulk Retrieval | Notes |
|---------|---------------|------------|----------------|-------|
| **SNMPv1** | Community strings (plaintext) | None | No | Legacy; RFC 1157; insecure |
| **SNMPv2c** | Community strings (plaintext) | None | Yes (get-bulk) | Better error messages; RFC 1901-1908 |
| **SNMPv3** | Username-based (HMAC-MD5/SHA) | Yes (DES/3DES/AES) | Yes | RFC 3410-3415; recommended |

### 11.2.4 Community Strings (SNMPv1/v2c)

Community strings are **plaintext passwords** that authenticate access to the MIB:

| Type | Permission | Description |
|------|-----------|-------------|
| **Read-only (ro)** | Read MIB variables | Cannot modify; commonly used in v2c |
| **Read-write (rw)** | Read and write all MIB objects | Can modify configuration; very dangerous if exposed |

**Security concern:** Community strings are sent in **cleartext** -- anyone sniffing the network can capture them. This is why SNMPv3 is recommended.

### 11.2.5 SNMPv3 Security Levels

| Level | Authentication | Encryption | Description |
|-------|---------------|------------|-------------|
| **noAuthNoPriv** | Username only | No | Least secure; username sent in cleartext |
| **authNoPriv** | HMAC-MD5 or HMAC-SHA | No | Authentication but data in cleartext |
| **authPriv** | HMAC-MD5 or HMAC-SHA | DES, 3DES, or AES | Most secure; recommended |

### 11.2.6 MIB (Management Information Base)

- Organizes variables **hierarchically** (tree structure)
- Each variable is identified by an **OID (Object Identifier)**
- OIDs are unique identifiers: e.g., `1.3.6.1.4.1.9` = .iso.org.dod.internet.private.enterprises.cisco
- Contains both **common public variables** (RFC-defined, common to many devices) and **vendor-specific private branches**

### 11.2.7 SNMP Configuration

```cisco
! SNMPv2c configuration
R1(config)# snmp-server community READONLY ro
R1(config)# snmp-server community READWRITE rw

! Configure SNMP trap destination
R1(config)# snmp-server host 192.168.1.100 version 2c READONLY

! Enable specific traps
R1(config)# snmp-server enable traps
R1(config)# snmp-server enable traps snmp linkdown linkup

! Set SNMP contact and location information
R1(config)# snmp-server contact admin@example.com
R1(config)# snmp-server location "Main Data Center"

! SNMPv3 configuration
R1(config)# snmp-server group ADMIN v3 priv
R1(config)# snmp-server user admin1 ADMIN v3 auth sha AuthPass123 priv aes 128 PrivPass123
R1(config)# snmp-server host 192.168.1.100 version 3 priv admin1
```

### 11.2.8 SNMP Verification

```cisco
! Show SNMP configuration
R1# show snmp

! Show SNMP community strings
R1# show snmp community

! Show SNMP groups (v3)
R1# show snmp group

! Show SNMP users (v3)
R1# show snmp user

! Show SNMP host (trap destinations)
R1# show snmp host
```

> **Oral Exam Tip:** Always recommend SNMPv3 with `authPriv` for production environments. SNMPv1/v2c community strings are **plaintext** and offer no real security. Know the three SNMPv3 security levels. Traps use UDP 162 (agent to manager); polling uses UDP 161 (manager to agent). Be able to explain the difference between polling (get) and traps (unsolicited notifications).

## 11.3 NTP (Network Time Protocol)

### 11.3.1 Why Time Synchronization Matters

- When the time is **not synchronized** between devices, it is **impossible to determine the order of events** and the cause of security incidents
- Log correlation across multiple devices requires consistent timestamps
- Certificate validation, authentication protocols, and forensic analysis all depend on accurate time
- NTP uses **UDP port 123**, documented in **RFC 1305**

### 11.3.2 NTP Stratum Hierarchy

NTP uses a hierarchical system of time sources called **strata**:

| Stratum | Description |
|---------|-------------|
| **Stratum 0** | Authoritative time sources (GPS clocks, atomic clocks); high-precision, negligible delay |
| **Stratum 1** | Devices directly connected to Stratum 0; primary network time standard |
| **Stratum 2** | Synchronized to Stratum 1 via network; can serve Stratum 3 devices |
| **Stratum 3-15** | Each level synchronized to the level above it |
| **Stratum 16** | Unsynchronized (lowest level; device cannot provide time) |

**Maximum hop count:** 15 strata. Stratum 16 means the device is unsynchronized.

**Peers:** Time servers at the same stratum level can be configured as peers for backup or time verification.

### 11.3.3 NTP Configuration

```cisco
! Set the clock manually (if NTP not available)
R1# clock set 20:36:00 nov 15 2024

! Configure NTP server
R1(config)# ntp server 209.165.200.225

! Configure NTP on a downstream device (using R1 as server)
S1(config)# ntp server 192.168.1.1

! Configure NTP authentication (prevent rogue NTP servers)
R1(config)# ntp authenticate
R1(config)# ntp authentication-key 1 md5 NTPsecret
R1(config)# ntp trusted-key 1
R1(config)# ntp server 209.165.200.225 key 1

! Configure the router as an NTP master (authoritative source)
R1(config)# ntp master 3
```

### 11.3.4 NTP Verification

```cisco
! Check current clock and time source
R1# show clock detail

! Show NTP associations (which server is synced)
R1# show ntp associations

! Show NTP synchronization status (stratum level, reference)
R1# show ntp status
```

**Example output:**
```
R1# show ntp associations
  address        ref clock    st   when  poll  each delay  offset   disp
*~209.165.200.225 .Gps.       1    61    64    377  0.481  7.480    4.261

R1# show ntp status
Clock is synchronized, stratum 2, reference is 209.165.200.225
```

**Key symbols in `show ntp associations`:**
- `*` = sys.peer (currently synchronized to)
- `#` = selected
- `+` = candidate
- `-` = outlier
- `x` = falseticker
- `~` = configured

> **Oral Exam Tip:** NTP is critical for security because without synchronized time, you cannot correlate logs across devices during incident investigation. Know the stratum hierarchy. A device synchronized to a Stratum 1 server becomes **Stratum 2**. Always enable `service timestamps log datetime` alongside NTP configuration. NTP authentication prevents accepting time from rogue NTP servers.

## 11.4 SIEM (Security Information and Event Management)

### 11.4.1 What is SIEM?

**SIEM** is a technology used in enterprise organizations to provide **real-time reporting** and **long-term analysis** of security events by aggregating data from multiple sources.

### 11.4.2 Essential SIEM Functions

| Function | Description |
|----------|-------------|
| **Forensic Analysis** | Search logs and event records from all sources for complete forensic investigation |
| **Correlation** | Examine logs from different systems/applications to speed detection of and reaction to security threats |
| **Aggregation** | Reduce event data volume by consolidating duplicate event records |
| **Reporting** | Present correlated and aggregated data in real-time monitoring and long-term summaries |

### 11.4.3 SIEM Data Types

SIEM provides details on suspicious activity including:
- **User information**: Username, authentication status, location
- **Device information**: Manufacturer, model, OS version, MAC address, network connection method, location
- **Posture information**: Compliance with security policy, antivirus updates, OS patches

### 11.4.4 SIEM Products

- **Open source**: Security Onion with ELK suite:
  - **Elasticsearch**: Document-oriented full-text search engine
  - **Logstash**: Pipeline processing system (inputs -> filters -> outputs)
  - **Kibana**: Browser-based analytics and search dashboard
- **Commercial**: SolarWinds Security Event Manager, Splunk Enterprise Security

> **Oral Exam Tip:** SIEM aggregates logs from ALL network devices (firewalls, IDS/IPS, servers, endpoints) into a single platform for correlation and analysis. The four key functions are: forensic analysis, correlation, aggregation, and reporting. It is the analyst's primary tool for identifying and investigating security incidents.

## 11.5 SOAR (Security Orchestration, Automation, and Response)

### 11.5.1 What is SOAR?

**SOAR** enhances SIEM by adding **orchestration, automation, and incident response** capabilities.

### 11.5.2 SOAR Capabilities

| Capability | Description |
|-----------|-------------|
| **Case Management** | Tools to research and investigate incidents; integrates threat intelligence into the security platform |
| **AI-Powered Detection** | Uses artificial intelligence to detect incidents and aid in analysis and response |
| **Automated Response** | Automates complex incident response procedures using **run books** (pre-defined response workflows) |
| **Dashboards and Reports** | Documents incident response; improves SOC key performance indicators |

### 11.5.3 SIEM vs SOAR

| Aspect | SIEM | SOAR |
|--------|------|------|
| Primary function | Detect and alert | Respond and automate |
| Data handling | Collect, correlate, report | Orchestrate, automate response |
| Analyst role | Analyst investigates alerts | SOAR helps analyst **respond** to threats |
| Automation | Minimal | Extensive (run books, playbooks) |

> **Oral Exam Tip:** The key difference: SIEM **identifies** threats through correlation and alerting; SOAR **responds** to threats through automation and orchestration. SOAR executes "run books" -- pre-defined automated response procedures that reduce the manual workload on SOC analysts. In modern SOCs, SIEM and SOAR work together.

## 11.6 Network Monitoring Methods

### 11.6.1 Network Taps

- **Passive splitting devices** placed inline between two network points
- Forward **all traffic** (including physical layer errors) to an analysis device
- Traffic flow between network devices is **not affected** (fail-safe)
- Send TX and RX data streams on **separate, dedicated channels**
- Provide **real-time** data capture

### 11.6.2 SPAN (Switch Port Analyzer) / Port Mirroring

- Copies frames from one or more **source ports** to a **destination (SPAN) port**
- The destination port connects to an analysis device (packet analyzer, IDS)
- Association between source and destination ports = **SPAN session**
- Can mirror a single port, multiple ports, or an entire **VLAN**
- **RSPAN (Remote SPAN)**: Uses VLANs to mirror traffic to a remote switch

| SPAN Term | Description |
|-----------|-------------|
| **Ingress traffic** | Traffic entering the switch |
| **Egress traffic** | Traffic leaving the switch |
| **Source port** | Port being monitored (traffic is replicated) |
| **Destination port** | Port connected to analysis device (receives mirrored traffic) |

### 11.6.3 NetFlow

- **Cisco IOS technology** providing 24/7 statistics on packets flowing through a device
- Standard for collecting IP operational data
- Used for: security monitoring, network planning, traffic analysis, audit trails
- Stores flow information in a **local cache** and forwards to a **NetFlow collector**
- Tracks: source/destination IP, ports, protocol, byte/packet counts, timestamps

### 11.6.4 Protocol Analyzers

- **Wireshark**: Most popular open-source protocol analyzer (Windows, Linux, Mac)
- **tcpdump**: Command-line packet capture tool (Linux/Unix)
- **tshark**: Wireshark command-line tool
- **windump**: Windows variant of tcpdump
- Captured data saved in **PCAP** format

### 11.6.5 Monitoring Verification Commands

```cisco
! Show CDP neighbors (Cisco devices)
R1# show cdp neighbors
R1# show cdp neighbors detail

! Show LLDP neighbors (vendor-neutral)
S1# show lldp neighbors
S1# show lldp neighbors detail

! Enable/disable CDP
R1(config)# cdp run
R1(config)# no cdp run
R1(config-if)# cdp enable
R1(config-if)# no cdp enable

! Enable/disable LLDP
Switch(config)# lldp run
Switch(config-if)# lldp transmit
Switch(config-if)# lldp receive
Switch# show lldp
```

> **Oral Exam Tip:** For monitoring, know the difference between TAPs (passive, inline, fail-safe, real-time) and SPAN (switch-based, copies to analysis port, can affect switch performance). CDP is Cisco-proprietary; LLDP is vendor-neutral -- both operate at Layer 2. In a security context, CDP/LLDP should be **disabled on ports facing untrusted networks** to prevent information leakage.

