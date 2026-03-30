import Ticket from '../models/Ticket.js';

// Create a new ticket
export const createTickets = async (req, res) => {
    try {
        const ticket = await Ticket.create({
            title: req.body.title,
            description: req.body.description,
            status: 'Open',
            user: req.user.id
        });
        res.status(201).json(ticket)
    } catch (err) {
        res.status(500).json({ message: 'Could not create ticket' });
    }
}

export const getTickets = async (req,res) => {
    try {
        const query = req.user.role === 'admin' ? {} : { user: req.user.id };
        const tickets = await Ticket.find(query)
            .populate('user', 'name email role')
            .sort({ createdAt: -1 });
        res.json(tickets)
    } catch (err) {
        res.status(500).json({ message: 'Could not fetch tickets' });
    }
}

export const updateTicket = async (req, res) =>{
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can update ticket status' });
        }

        const { status } = req.body;
        if (!['Open', 'In Progress', 'Closed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.json(ticket);
    } catch (err) {
        res.status(500).json({ message: 'Could not update ticket' });
    }
}