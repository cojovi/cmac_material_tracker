CREATE TABLE builders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        );
CREATE TABLE sqlite_sequence(name,seq);
CREATE TABLE employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL UNIQUE,
            team TEXT NOT NULL CHECK(team IN ('CMAC','Builder')) DEFAULT 'CMAC',
            email TEXT,
            phone TEXT
        );
CREATE TABLE roles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            category TEXT
        );
CREATE TABLE assignments (
            builder_id INTEGER NOT NULL,
            role_id INTEGER NOT NULL,
            employee_id INTEGER NOT NULL,
            source TEXT,
            PRIMARY KEY (builder_id, role_id),
            FOREIGN KEY (builder_id) REFERENCES builders(id) ON DELETE CASCADE,
            FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
            FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
        );
CREATE TABLE builder_contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            builder_id INTEGER NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('purchasing_manager','project_manager','accounts_receivable')),
            full_name TEXT,
            email TEXT,
            phone TEXT,
            FOREIGN KEY (builder_id) REFERENCES builders(id) ON DELETE CASCADE
        );
CREATE TABLE communities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            builder_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            city TEXT,
            state TEXT,
            bolt_id INTEGER,
            office TEXT,
            FOREIGN KEY (builder_id) REFERENCES builders(id) ON DELETE CASCADE
        );
CREATE INDEX idx_builders_name ON builders(name);
CREATE INDEX idx_employees_name ON employees(full_name);
CREATE INDEX idx_assignments_b ON assignments(builder_id);
CREATE INDEX idx_communities_b ON communities(builder_id);
CREATE TABLE acculynx_workflow_milestones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    acculynx_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE acculynx_statuses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    acculynx_id TEXT NOT NULL UNIQUE,
    milestone_id INTEGER,
    name TEXT NOT NULL,
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (milestone_id) REFERENCES acculynx_workflow_milestones(id) ON DELETE CASCADE
);
CREATE TABLE acculynx_contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    acculynx_id TEXT NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    mobile_phone TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    company_name TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE acculynx_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    acculynx_id TEXT NOT NULL UNIQUE,
    job_name TEXT,
    job_number TEXT,
    milestone TEXT,
    status TEXT,
    status_id INTEGER,
    contact_id INTEGER,
    assigned_to_user_id TEXT,
    assigned_to_user_name TEXT,
    created_date TIMESTAMP,
    modified_date TIMESTAMP,
    milestone_date TIMESTAMP,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    latitude REAL,
    longitude REAL,
    job_type TEXT,
    sales_rep TEXT,
    estimator TEXT,
    project_manager TEXT,
    insurance_company TEXT,
    claim_number TEXT,
    deductible REAL,
    total_amount REAL,
    notes TEXT,
    raw_data TEXT,  -- Store full JSON response for reference
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES acculynx_contacts(id) ON DELETE SET NULL,
    FOREIGN KEY (status_id) REFERENCES acculynx_statuses(id) ON DELETE SET NULL
);
CREATE INDEX idx_acculynx_jobs_milestone ON acculynx_jobs(milestone);
CREATE INDEX idx_acculynx_jobs_status ON acculynx_jobs(status);
CREATE INDEX idx_acculynx_jobs_contact ON acculynx_jobs(contact_id);
CREATE INDEX idx_acculynx_jobs_modified ON acculynx_jobs(modified_date);
CREATE INDEX idx_acculynx_jobs_synced ON acculynx_jobs(last_synced_at);
CREATE INDEX idx_acculynx_contacts_email ON acculynx_contacts(email);
CREATE INDEX idx_acculynx_contacts_phone ON acculynx_contacts(phone);
CREATE TRIGGER update_acculynx_contacts_timestamp 
    AFTER UPDATE ON acculynx_contacts
    BEGIN
        UPDATE acculynx_contacts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
CREATE TRIGGER update_acculynx_jobs_timestamp 
    AFTER UPDATE ON acculynx_jobs
    BEGIN
        UPDATE acculynx_jobs SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
CREATE TABLE materials (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    manufacturer TEXT,
    product_category TEXT,
    distributor TEXT,
    ticker_symbol TEXT,
    current_price REAL,
    previous_price REAL,
    last_updated TEXT,
    updated_by INTEGER
);
