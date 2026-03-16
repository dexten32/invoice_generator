import React from 'react';
import {
    Box,
    Stack,
    Input,
    Textarea,
    Text,
    IconButton,
    Heading,
    Flex,
    Separator,
    Spinner,
} from '@chakra-ui/react';
import {
    AccordionItem,
    AccordionItemContent,
    AccordionItemTrigger,
    AccordionRoot,
} from '@/components/ui/accordion';
import { Field } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import {
    LuPlus,
    LuTrash2,
    LuBuilding2,
    LuUser,
    LuCalendar,
    LuListChecks,
    LuCalculator,
    LuImage,
    LuUpload,
    LuGlobe,
    LuMail,
    LuChevronDown,
    LuPackage,
    LuCircleAlert,
} from 'react-icons/lu';
import { useApiData } from '@/hooks/useApiData';
import './InvoiceEditor.css';

// ─── Reusable styled select ──────────────────────────────────────────────────
const StyledSelect = ({ id, value, onChange, disabled, children, placeholder }) => (
    <div className="editor-select-wrap">
        <select
            id={id}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="editor-select"
        >
            {placeholder && <option value="">{placeholder}</option>}
            {children}
        </select>
        <LuChevronDown className="editor-select-icon" />
    </div>
);

// ─── Fetch state display helpers ─────────────────────────────────────────────
const FetchLoading = ({ label }) => (
    <Flex align="center" gap="2" py="2" color="gray.400">
        <Spinner size="xs" />
        <Text fontSize="xs">Loading {label}…</Text>
    </Flex>
);

const FetchError = ({ message }) => (
    <Flex align="center" gap="2" py="2" color="red.400">
        <LuCircleAlert size="14" />
        <Text fontSize="xs">{message}</Text>
    </Flex>
);

// ─── Main Component ──────────────────────────────────────────────────────────
const InvoiceEditor = ({ data, onChange }) => {
    if (!data) return null;

    // Fetch customers and services from backend
    const {
        data: customersData,
        isLoading: customersLoading,
        error: customersError,
    } = useApiData('/customers');

    const {
        data: servicesData,
        isLoading: servicesLoading,
        error: servicesError,
    } = useApiData('/services');

    const customers = customersData?.customers ?? [];
    const services = servicesData?.services ?? [];

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleChange = (section, field, value) => {
        onChange((prev) => ({
            ...prev,
            [section]: { ...prev[section], [field]: value },
        }));
    };

    // When a customer is picked, auto-fill all client fields
    const handleCustomerSelect = (e) => {
        const id = e.target.value;
        const customer = customers.find((c) => c.id === id);
        if (!customer) {
            onChange((prev) => ({
                ...prev,
                client: { id: '', name: '', email: '', phone: '', gstNumber: '', address1: '', address2: '' },
            }));
            return;
        }
        onChange((prev) => ({
            ...prev,
            client: {
                id: customer.id,
                name: customer.name,
                email: customer.email ?? '',
                phone: customer.phone ?? '',
                gstNumber: customer.gstNumber ?? '',
                address1: '',
                address2: '',
            },
        }));
    };

    // When a service is picked for a line item, auto-fill rate, description, gstRate
    const handleServiceSelect = (itemId, serviceId) => {
        const service = services.find((s) => s.id === serviceId);
        onChange((prev) => ({
            ...prev,
            items: prev.items.map((item) =>
                item.id === itemId
                    ? {
                        ...item,
                        serviceId: serviceId,
                        description: service?.name ?? '',
                        longDescription: service?.description ?? '',
                        rate: service?.defaultPrice ?? 0,
                        gstRate: service?.gstRate ?? 0,
                    }
                    : item
            ),
        }));
    };

    const handleItemChange = (id, field, value) => {
        onChange((prev) => ({
            ...prev,
            items: prev.items.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            ),
        }));
    };

    const addItem = () => {
        onChange((prev) => ({
            ...prev,
            items: [
                ...prev.items,
                {
                    id: Date.now(),
                    serviceId: '',
                    description: '',
                    longDescription: '',
                    rate: 0,
                    quantity: 1,
                    gstRate: 0,
                },
            ],
        }));
    };

    const removeItem = (id) => {
        onChange((prev) => ({
            ...prev,
            items: prev.items.filter((item) => item.id !== id),
        }));
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => handleChange('business', 'logo', reader.result);
            reader.readAsDataURL(file);
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="invoice-editor">
            <header className="editor-header">
                <Flex align="center" gap="3">
                    <Box bg="blue.600" p="2" borderRadius="lg">
                        <LuCalculator color="white" size="24" />
                    </Box>
                    <Box>
                        <Heading size="lg" fontWeight="extrabold" color="gray.900">Invoice Editor</Heading>
                        <Text color="gray.600" fontSize="sm">Manage your business and client details.</Text>
                    </Box>
                </Flex>
            </header>

            <AccordionRoot collapsible defaultValue={['items']} variant="subtle" spaceY="4">

                {/* ── Business Information ── */}
                <AccordionItem value="business">
                    <AccordionItemTrigger fontWeight="bold" color="gray.800">
                        <Flex align="center" gap="2">
                            <LuBuilding2 size="18" className="text-blue-500" />
                            Business Information
                        </Flex>
                    </AccordionItemTrigger>
                    <AccordionItemContent>
                        <Stack gap="4" p="2">
                            {/* Logo upload */}
                            <Box className="logo-upload-area" onClick={() => document.getElementById('logo-input').click()}>
                                {data.business.logo ? (
                                    <Box position="relative">
                                        <img src={data.business.logo} alt="Logo Preview" className="logo-preview-img" />
                                        <Box className="logo-overlay"><LuUpload /> Change Logo</Box>
                                    </Box>
                                ) : (
                                    <Stack align="center" gap="1" color="gray.500">
                                        <LuImage size="24" />
                                        <Text fontSize="xs">Upload Business Logo</Text>
                                    </Stack>
                                )}
                                <input id="logo-input" type="file" accept="image/*" onChange={handleLogoUpload} hidden />
                            </Box>

                            <Field label="Business Name">
                                <Input
                                    value={data.business.name}
                                    onChange={(e) => handleChange('business', 'name', e.target.value)}
                                    placeholder="e.g. Acme Corp"
                                />
                            </Field>
                            <Field label="Tax Number / GSTIN">
                                <Input
                                    value={data.business.number}
                                    onChange={(e) => handleChange('business', 'number', e.target.value)}
                                    placeholder="e.g. 29AAAAA0000A1Z5"
                                />
                            </Field>
                            <Stack direction="row" gap="4">
                                <Field label="Address Line 1" flex="1">
                                    <Input
                                        value={data.business.address1}
                                        onChange={(e) => handleChange('business', 'address1', e.target.value)}
                                        placeholder="Street address"
                                    />
                                </Field>
                                <Field label="Address Line 2" flex="1">
                                    <Input
                                        value={data.business.address2}
                                        onChange={(e) => handleChange('business', 'address2', e.target.value)}
                                        placeholder="City, State"
                                    />
                                </Field>
                            </Stack>
                            <Stack direction="row" gap="4">
                                <Field label="Email Address" flex="1">
                                    <Flex align="center" gap="2" width="full">
                                        <LuMail size="16" className="text-gray-400" />
                                        <Input
                                            type="email"
                                            value={data.business.email}
                                            onChange={(e) => handleChange('business', 'email', e.target.value)}
                                        />
                                    </Flex>
                                </Field>
                                <Field label="Website" flex="1">
                                    <Flex align="center" gap="2" width="full">
                                        <LuGlobe size="16" className="text-gray-400" />
                                        <Input
                                            value={data.business.website}
                                            onChange={(e) => handleChange('business', 'website', e.target.value)}
                                            placeholder="www.yoursite.com"
                                        />
                                    </Flex>
                                </Field>
                            </Stack>
                        </Stack>
                    </AccordionItemContent>
                </AccordionItem>

                {/* ── Client Information — Customer Dropdown ── */}
                <AccordionItem value="client">
                    <AccordionItemTrigger fontWeight="bold" color="gray.800">
                        <Flex align="center" gap="2">
                            <LuUser size="18" className="text-blue-500" />
                            Client Information
                        </Flex>
                    </AccordionItemTrigger>
                    <AccordionItemContent>
                        <Stack gap="4" p="2">
                            <Field label="Select Customer">
                                {customersLoading && <FetchLoading label="customers" />}
                                {customersError && <FetchError message="Cannot connect to backend. Start the server on port 4000." />}
                                {!customersLoading && !customersError && (
                                    <StyledSelect
                                        id="customer-select"
                                        value={data.client?.id ?? ''}
                                        onChange={handleCustomerSelect}
                                        placeholder={customers.length === 0 ? '— No customers in database —' : '— Choose a customer —'}
                                    >
                                        {customers.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </StyledSelect>
                                )}
                            </Field>

                            {/* Read-only preview of selected customer details */}
                            {data.client?.name && (
                                <Box className="customer-detail-card">
                                    <Flex gap="3" wrap="wrap">
                                        {data.client.name && (
                                            <Box className="customer-detail-item">
                                                <Text className="customer-detail-label">Name</Text>
                                                <Text className="customer-detail-value">{data.client.name}</Text>
                                            </Box>
                                        )}
                                        {data.client.email && (
                                            <Box className="customer-detail-item">
                                                <Text className="customer-detail-label">Email</Text>
                                                <Text className="customer-detail-value">{data.client.email}</Text>
                                            </Box>
                                        )}
                                        {data.client.phone && (
                                            <Box className="customer-detail-item">
                                                <Text className="customer-detail-label">Phone</Text>
                                                <Text className="customer-detail-value">{data.client.phone}</Text>
                                            </Box>
                                        )}
                                        {data.client.gstNumber && (
                                            <Box className="customer-detail-item">
                                                <Text className="customer-detail-label">GST</Text>
                                                <Text className="customer-detail-value">{data.client.gstNumber}</Text>
                                            </Box>
                                        )}
                                    </Flex>
                                </Box>
                            )}
                        </Stack>
                    </AccordionItemContent>
                </AccordionItem>

                {/* ── Invoice Metadata ── */}
                <AccordionItem value="meta">
                    <AccordionItemTrigger fontWeight="bold" color="gray.800">
                        <Flex align="center" gap="2">
                            <LuCalendar size="18" className="text-blue-500" />
                            Invoice Meta Details
                        </Flex>
                    </AccordionItemTrigger>
                    <AccordionItemContent>
                        <Stack direction="row" gap="4" p="2">
                            <Field label="Invoice #" flex="1">
                                <Input
                                    value={data.meta.invoiceNumber}
                                    onChange={(e) => handleChange('meta', 'invoiceNumber', e.target.value)}
                                    placeholder="INV-001"
                                />
                            </Field>
                            <Field label="Date" flex="1">
                                <Input
                                    value={data.meta.date}
                                    onChange={(e) => handleChange('meta', 'date', e.target.value)}
                                />
                            </Field>
                            <Field label="Due Statement" flex="1">
                                <Input
                                    value={data.meta.dueDate}
                                    onChange={(e) => handleChange('meta', 'dueDate', e.target.value)}
                                    placeholder="On Receipt"
                                />
                            </Field>
                        </Stack>
                    </AccordionItemContent>
                </AccordionItem>

                {/* ── Line Items — Service Picker ── */}
                <AccordionItem value="items">
                    <AccordionItemTrigger fontWeight="bold" color="gray.800">
                        <Flex align="center" gap="2">
                            <LuListChecks size="18" className="text-blue-500" />
                            Line Items ({data.items.length})
                        </Flex>
                    </AccordionItemTrigger>
                    <AccordionItemContent>
                        <Stack gap="6" p="2">
                            {servicesLoading && <FetchLoading label="services" />}
                            {servicesError && <FetchError message="Cannot connect to backend. Start the server on port 4000." />}

                            {data.items.map((item, index) => (
                                <Box
                                    key={item.id}
                                    p="5"
                                    borderWidth="1px"
                                    borderRadius="xl"
                                    position="relative"
                                    bg="white"
                                    boxShadow="sm"
                                    className="item-card-hover"
                                >
                                    <Stack gap="4">
                                        <Flex justify="space-between" align="center">
                                            <Box bg="blue.50" px="3" py="1" borderRadius="full">
                                                <Text fontWeight="bold" fontSize="xs" color="blue.600">ITEM #{index + 1}</Text>
                                            </Box>
                                            <IconButton
                                                size="sm"
                                                variant="subtle"
                                                colorPalette="red"
                                                aria-label="Remove item"
                                                onClick={() => removeItem(item.id)}
                                                className="rounded-full"
                                            >
                                                <LuTrash2 />
                                            </IconButton>
                                        </Flex>

                                        {/* Service selector */}
                                        <Field label="Select Service / Product">
                                            <StyledSelect
                                                id={`service-select-${item.id}`}
                                                value={item.serviceId ?? ''}
                                                onChange={(e) => handleServiceSelect(item.id, e.target.value)}
                                                disabled={servicesLoading}
                                                placeholder={
                                                    servicesLoading
                                                        ? 'Loading services…'
                                                        : services.length === 0
                                                        ? '— No services in database —'
                                                        : '— Choose a service —'
                                                }
                                            >
                                                {services.map((s) => (
                                                    <option key={s.id} value={s.id}>
                                                        {s.name} — ₹{Number(s.defaultPrice).toLocaleString('en-IN')} ({s.gstRate}% GST)
                                                    </option>
                                                ))}
                                            </StyledSelect>
                                        </Field>

                                        {/* Additional notes — still editable */}
                                        <Field label="Additional Notes (Optional)">
                                            <Textarea
                                                value={item.longDescription}
                                                onChange={(e) => handleItemChange(item.id, 'longDescription', e.target.value)}
                                                placeholder="Detailed notes or description"
                                                size="sm"
                                                rows={2}
                                            />
                                        </Field>

                                        <Flex gap="4">
                                            <Field label="Rate (₹)" flex="2">
                                                <Input
                                                    type="number"
                                                    value={item.rate}
                                                    onChange={(e) => handleItemChange(item.id, 'rate', parseFloat(e.target.value) || 0)}
                                                    textAlign="right"
                                                />
                                            </Field>
                                            <Field label="Qty" flex="1">
                                                <Input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                                    textAlign="center"
                                                />
                                            </Field>
                                            <Field label="GST %" flex="1">
                                                <Input
                                                    type="number"
                                                    value={item.gstRate}
                                                    onChange={(e) => handleItemChange(item.id, 'gstRate', parseFloat(e.target.value) || 0)}
                                                    textAlign="center"
                                                />
                                            </Field>
                                            <Field label="Amount" flex="2">
                                                <Box
                                                    bg="gray.50"
                                                    px="3"
                                                    h="40px"
                                                    display="flex"
                                                    alignItems="center"
                                                    borderRadius="md"
                                                    border="1px solid #e2e8f0"
                                                >
                                                    <Text fontWeight="bold" color="gray.700" ml="auto">
                                                        ₹{(item.rate * item.quantity).toLocaleString('en-IN')}
                                                    </Text>
                                                </Box>
                                            </Field>
                                        </Flex>

                                        {/* Per-item GST preview */}
                                        {item.gstRate > 0 && (
                                            <Flex justify="flex-end">
                                                <Text fontSize="xs" color="gray.500">
                                                    + ₹{((item.rate * item.quantity * item.gstRate) / 100).toLocaleString('en-IN')} GST ({item.gstRate}%)
                                                </Text>
                                            </Flex>
                                        )}
                                    </Stack>
                                </Box>
                            ))}

                            <Button
                                variant="outline"
                                colorPalette="blue"
                                onClick={addItem}
                                width="full"
                                size="lg"
                                className="border-dashed"
                            >
                                <LuPlus /> Add Line Item
                            </Button>

                            <Separator />

                            <Stack direction="row" gap="4">
                                <Field label="Tax Rate (%) — global" flex="1">
                                    <Input
                                        type="number"
                                        value={data.taxRate}
                                        onChange={(e) => onChange((prev) => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                                        placeholder="18"
                                    />
                                </Field>
                                <Field label="Discount (₹)" flex="1">
                                    <Input
                                        type="number"
                                        value={data.discount}
                                        onChange={(e) => onChange((prev) => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                                        placeholder="0"
                                    />
                                </Field>
                            </Stack>
                        </Stack>
                    </AccordionItemContent>
                </AccordionItem>
            </AccordionRoot>

            <Box mt="6" p="6" bg="white" borderRadius="xl" border="1px solid #e2e8f0">
                <Field label="Footer / Payment Notes">
                    <Textarea
                        value={data.footerNotes}
                        onChange={(e) => onChange((prev) => ({ ...prev, footerNotes: e.target.value }))}
                        placeholder="e.g. Bank Account Details or Terms"
                        variant="plain"
                        size="sm"
                        minH="100px"
                    />
                </Field>
            </Box>
        </div>
    );
};

export default InvoiceEditor;
